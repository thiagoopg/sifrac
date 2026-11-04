package br.edu.ifrs.poa.hcomplementares.service;

import br.edu.ifrs.poa.hcomplementares.dto.request.SolicitacaoAvaliacaoRequest;
import br.edu.ifrs.poa.hcomplementares.dto.request.SolicitacaoCreateRequest;
import br.edu.ifrs.poa.hcomplementares.dto.response.AnexoResponse;
import br.edu.ifrs.poa.hcomplementares.dto.response.SolicitacaoResponse;
import br.edu.ifrs.poa.hcomplementares.entity.Aluno;
import br.edu.ifrs.poa.hcomplementares.entity.AnexoSolicitacao;
import br.edu.ifrs.poa.hcomplementares.entity.Curso;
import br.edu.ifrs.poa.hcomplementares.entity.SolicitacaoHoraComplementar;
import br.edu.ifrs.poa.hcomplementares.entity.TipoHoraComplementar;
import br.edu.ifrs.poa.hcomplementares.entity.Usuario;
import br.edu.ifrs.poa.hcomplementares.enums.RequestStatus;
import br.edu.ifrs.poa.hcomplementares.enums.UserProfile;
import br.edu.ifrs.poa.hcomplementares.exception.BusinessRuleException;
import br.edu.ifrs.poa.hcomplementares.exception.ResourceNotFoundException;
import br.edu.ifrs.poa.hcomplementares.repository.AlunoRepository;
import br.edu.ifrs.poa.hcomplementares.repository.AnexoSolicitacaoRepository;
import br.edu.ifrs.poa.hcomplementares.repository.CursoRepository;
import br.edu.ifrs.poa.hcomplementares.repository.SolicitacaoRepository;
import br.edu.ifrs.poa.hcomplementares.repository.TipoHoraComplementarRepository;
import br.edu.ifrs.poa.hcomplementares.repository.UsuarioRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.transaction.support.TransactionSynchronization;
import org.springframework.transaction.support.TransactionSynchronizationManager;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.StandardCopyOption;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;
import br.edu.ifrs.poa.hcomplementares.event.SolicitacaoAvaliadaEvent;
import br.edu.ifrs.poa.hcomplementares.event.SolicitacaoCriadaEvent;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class SolicitacaoService {

    private final SolicitacaoRepository solicitacaoRepository;
    private final AlunoRepository alunoRepository;
    private final TipoHoraComplementarRepository tipoHoraRepository;
    private final UsuarioRepository usuarioRepository;
    private final CursoRepository cursoRepository;
    private final AnexoSolicitacaoRepository anexoSolicitacaoRepository;
    private final NotificacaoService notificacaoService;
    private final RequestAuditService requestAuditService;
    private final ApplicationEventPublisher eventPublisher;

    /**
     * Diretório base onde os anexos das solicitações são gravados.
     * Externalizado para permitir configuração por ambiente e testes.
     */
    @Value("${app.upload.dir:uploads/solicitacoes}")
    private String uploadDir;

    // =====================================================
    // CRIAR SOLICITAÇÃO
    // =====================================================

    @Transactional
    public SolicitacaoResponse criar(SolicitacaoCreateRequest request) {

        Usuario usuarioAtual = getUsuarioAtual();

        if (usuarioAtual.getPerfil() != UserProfile.ALUNO) {
            throw new BusinessRuleException(
                    "Apenas alunos podem criar solicitações.",
                    "PERFIL_INVALIDO"
            );
        }

        /*
         * O aluno é obtido pelo usuário autenticado.
         * O alunoId presente no request deixa de determinar
         * quem é o solicitante.
         */
        Aluno aluno = alunoRepository.findByUsuarioId(usuarioAtual.getId())
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Aluno",
                                usuarioAtual.getId()
                        )
                );

        TipoHoraComplementar tipoHora = tipoHoraRepository.findById(request.tipoHoraId())
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "TipoHoraComplementar",
                                request.tipoHoraId()
                        )
                );

        if (!aluno.getCurso().getId().equals(tipoHora.getCurso().getId())) {
            throw new BusinessRuleException(
                    "Aluno não pertence ao curso deste tipo de hora.",
                    "ALUNO_CURSO_MISMATCH"
            );
        }

        validarLimitesCargaHoraria(
                aluno,
                tipoHora,
                request.horasSolicitadas()
        );

        SolicitacaoHoraComplementar solicitacao =
                SolicitacaoHoraComplementar.builder()
                        .aluno(aluno)
                        .tipoHora(tipoHora)
                        .titulo(request.titulo())
                        .horasSolicitadas(request.horasSolicitadas())
                        .status(RequestStatus.PENDENTE)
                        .build();

        SolicitacaoHoraComplementar saved =
                solicitacaoRepository.save(solicitacao);

        requestAuditService.registrar(
                saved,
                usuarioAtual,
                "CRIACAO",
                null,
                "PENDENTE",
                "Solicitação criada pelo aluno."
        );

        publicarSolicitacaoCriada(saved);

        return toResponse(saved);
    }

    // =====================================================
    // AVALIAR SOLICITAÇÃO
    // =====================================================

    @Transactional
    public SolicitacaoResponse avaliar(
            Long id,
            SolicitacaoAvaliacaoRequest request
    ) {

        Usuario coordenador = getUsuarioAtual();

        if (coordenador.getPerfil() != UserProfile.COORDENADOR) {
            throw new BusinessRuleException(
                    "Apenas coordenadores podem avaliar solicitações.",
                    "NAO_E_COORDENADOR"
            );
        }

        SolicitacaoHoraComplementar solicitacao =
                solicitacaoRepository.findById(id)
                        .orElseThrow(() ->
                                new ResourceNotFoundException(
                                        "Solicitacao",
                                        id
                                )
                        );

        if (solicitacao.getStatus() != RequestStatus.PENDENTE) {
            throw new BusinessRuleException(
                    "Somente solicitacoes pendentes podem ser avaliadas.",
                    "STATUS_INVALIDO_AVALIACAO"
            );
        }

        Long cursoSolicitacaoId =
                solicitacao.getAluno()
                        .getCurso()
                        .getId();

        /*
         * O coordenador autenticado precisa ser o coordenador
         * responsável pelo curso da solicitação.
         *
         * Não confiamos mais em request.coordenadorId().
         */
        boolean eCoordenadorDoCurso =
                cursoRepository.findByCoordenadorId(coordenador.getId())
                        .stream()
                        .anyMatch(curso ->
                                curso.getId().equals(cursoSolicitacaoId)
                        );

        if (!eCoordenadorDoCurso) {
            throw new BusinessRuleException(
                    "Coordenador não possui permissão para avaliar solicitações deste curso.",
                    "COORDENADOR_CURSO_INVALIDO"
            );
        }

        if (request.horasDeferidas() != null
                && request.horasDeferidas() > solicitacao.getHorasSolicitadas()) {

            throw new BusinessRuleException(
                    "Horas deferidas nao podem exceder horas solicitadas.",
                    "HORAS_DEFERIDAS_EXCEDIDAS"
            );
        }

        RequestStatus statusAnterior = solicitacao.getStatus();

        solicitacao.setStatus(request.status());
        solicitacao.setHorasDeferidas(request.horasDeferidas());
        solicitacao.setJustificativaCoordenador(
                request.observacao()
        );

        /*
         * O coordenador armazenado na solicitação é sempre
         * o usuário autenticado.
         */
        solicitacao.setCoordenador(coordenador);
        solicitacao.setDataAvaliacao(LocalDateTime.now());

        requestAuditService.registrar(
                solicitacao,
                coordenador,
                "AVALIACAO",
                statusAnterior.name(),
                request.status().name(),
                request.observacao()
        );

        SolicitacaoHoraComplementar saved =
                solicitacaoRepository.save(solicitacao);

        RequestStatus novoStatus = request.status();

        if (novoStatus == RequestStatus.DEFERIDO
                || novoStatus == RequestStatus.INDEFERIDO) {

            notificacaoService.criar(
                    saved,
                    novoStatus,
                    coordenador
            );

            try {
                var alunoUsuario = saved.getAluno() != null ? saved.getAluno().getUsuario() : null;
                var alunoEntity = saved.getAluno();
                var tipoHora = saved.getTipoHora();
                eventPublisher.publishEvent(new SolicitacaoAvaliadaEvent(
                        saved.getId(),
                        alunoUsuario != null ? alunoUsuario.getEmail() : null,
                        alunoUsuario != null ? alunoUsuario.getNome() : null,
                        saved.getTitulo(),
                        novoStatus,
                        saved.getHorasSolicitadas(),
                        saved.getHorasDeferidas(),
                        saved.getJustificativaCoordenador(),
                        alunoEntity != null && alunoEntity.getCurso() != null ? alunoEntity.getCurso().getNome() : null,
                        tipoHora != null ? tipoHora.getNome() : null,
                        coordenador.getNome()
                ));
            } catch (Exception e) {
                // Ignorar falhas ao publicar evento para não quebrar fluxo de avaliação
            }
        }

        return toResponse(saved);
    }

    // =====================================================
    // CANCELAR SOLICITAÇÃO
    // =====================================================

    @Transactional
    public void cancelar(Long id) {

        Usuario usuarioAtual = getUsuarioAtual();

        if (usuarioAtual.getPerfil() != UserProfile.ALUNO) {
            throw new BusinessRuleException(
                    "Apenas alunos podem cancelar solicitações.",
                    "PERFIL_INVALIDO"
            );
        }

        SolicitacaoHoraComplementar solicitacao =
                solicitacaoRepository.findById(id)
                        .orElseThrow(() ->
                                new ResourceNotFoundException(
                                        "Solicitacao",
                                        id
                                )
                        );

        if (solicitacao.getStatus() != RequestStatus.PENDENTE
                && solicitacao.getStatus() != RequestStatus.DEFERIDO) {

            throw new BusinessRuleException(
                    "Somente solicitacoes pendentes ou deferidas podem ser canceladas.",
                    "STATUS_INVALIDO_CANCELAMENTO"
            );
        }

        /*
         * O dono da solicitação é determinado
         * pelo usuário autenticado.
         */
        boolean eDono =
                solicitacao.getAluno()
                        .getUsuario()
                        .getId()
                        .equals(usuarioAtual.getId());

        if (!eDono) {
            throw new BusinessRuleException(
                    "Voce não tem permissao para cancelar esta solicitação.",
                    "PERMISSAO_NEGADA"
            );
        }

        String statusAnterior =
                solicitacao.getStatus().name();

        solicitacao.setStatus(RequestStatus.CANCELADO);

        requestAuditService.registrar(
                solicitacao,
                usuarioAtual,
                "CANCELAMENTO",
                statusAnterior,
                "CANCELADO",
                "Solicitação cancelada pelo aluno."
        );

        solicitacaoRepository.save(solicitacao);
    }

    // =====================================================
    // LISTAR POR ALUNO
    // =====================================================

    public List<SolicitacaoResponse> listarPorAluno(Long alunoId) {

        Usuario usuarioAtual = getUsuarioAtual();

        Aluno aluno = alunoRepository.findById(alunoId)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Aluno",
                                alunoId
                        )
                );

        if (!podeAcessarAluno(usuarioAtual, aluno)) {
            throw new BusinessRuleException(
                    "Voce não tem permissao para visualizar as solicitações deste aluno.",
                    "PERMISSAO_NEGADA"
            );
        }

        return solicitacaoRepository
                .findByAlunoIdOrderByDataSolicitacaoDescWithAnexos(alunoId)
                .stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    // =====================================================
    // LISTAR POR CURSO
    // =====================================================

    public List<SolicitacaoResponse> listarPorCurso(Long cursoId) {

        Usuario usuarioAtual = getUsuarioAtual();

        if (!podeAcessarCurso(usuarioAtual, cursoId)) {
            throw new BusinessRuleException(
                    "Voce não tem permissao para visualizar solicitações deste curso.",
                    "PERMISSAO_NEGADA"
            );
        }

        return solicitacaoRepository
                .findByCursoIdOrderByDataSolicitacaoDescWithAnexos(cursoId)
                .stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    // =====================================================
    // LISTAR POR CAMPUS
    // =====================================================

    public List<SolicitacaoResponse> listarPorCampus(Long campusId) {

        Usuario usuarioAtual = getUsuarioAtual();

        if (!podeAcessarCampus(usuarioAtual, campusId)) {
            throw new BusinessRuleException(
                    "Voce não tem permissao para visualizar solicitações deste campus.",
                    "PERMISSAO_NEGADA"
            );
        }

        return solicitacaoRepository
                .findByCampusIdOrderByDataSolicitacaoDescWithAnexos(campusId)
                .stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    // =====================================================
    // LISTAR PENDENTES POR CURSO
    // =====================================================

    public List<SolicitacaoResponse> listarPendentesPorCurso(Long cursoId) {

        Usuario usuarioAtual = getUsuarioAtual();

        if (!podeAcessarCurso(usuarioAtual, cursoId)) {
            throw new BusinessRuleException(
                    "Voce não tem permissao para visualizar solicitações deste curso.",
                    "PERMISSAO_NEGADA"
            );
        }

        return solicitacaoRepository
                .findByStatusOrderByDataSolicitacaoDescWithAnexos(
                        RequestStatus.PENDENTE
                )
                .stream()
                .filter(s ->
                        s.getAluno()
                                .getCurso()
                                .getId()
                                .equals(cursoId)
                )
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    // =====================================================
    // LISTAR CONFORME PERFIL
    // =====================================================

    public List<SolicitacaoResponse> listarTodas() {

        Usuario usuarioAtual = getUsuarioAtual();

        return switch (usuarioAtual.getPerfil()) {

            case ADMINISTRADOR -> solicitacaoRepository
                    .findAllWithAnexos()
                    .stream()
                    .map(this::toResponse)
                    .collect(Collectors.toList());

            case ADMIN_CAMPUS -> {

                if (usuarioAtual.getCampus() == null) {
                    throw new BusinessRuleException(
                            "Administrador de campus não possui campus associado.",
                            "CAMPUS_NAO_INFORMADO"
                    );
                }

                yield solicitacaoRepository
                        .findByCampusIdOrderByDataSolicitacaoDescWithAnexos(
                                usuarioAtual.getCampus().getId()
                        )
                        .stream()
                        .map(this::toResponse)
                        .collect(Collectors.toList());
            }

            case COORDENADOR -> {

                List<SolicitacaoResponse> results =
                        cursoRepository
                                .findByCoordenadorId(usuarioAtual.getId())
                                .stream()
                                .flatMap(curso ->
                                        solicitacaoRepository
                                                .findByCursoIdOrderByDataSolicitacaoDescWithAnexos(
                                                        curso.getId()
                                                )
                                                .stream()
                                )
                                .map(this::toResponse)
                                .collect(Collectors.toList());

                yield results;
            }

            case ALUNO -> throw new BusinessRuleException(
                    "Alunos não podem listar todas as solicitações.",
                    "PERFIL_INVALIDO"
            );
        };
    }

    // =====================================================
    // LISTAR POR USUÁRIO / "MEU"
    // =====================================================

    public List<SolicitacaoResponse> listarPorUsuario(
            String status
    ) {

        Usuario usuarioAtual = getUsuarioAtual();

        List<SolicitacaoResponse> results;

        switch (usuarioAtual.getPerfil()) {

            case ADMINISTRADOR -> {

                results = solicitacaoRepository
                        .findAllWithAnexos()
                        .stream()
                        .map(this::toResponse)
                        .collect(Collectors.toList());
            }

            case ADMIN_CAMPUS -> {

                if (usuarioAtual.getCampus() == null) {
                    throw new BusinessRuleException(
                            "Administrador de campus não possui campus associado.",
                            "CAMPUS_NAO_INFORMADO"
                    );
                }

                results = solicitacaoRepository
                        .findByCampusIdOrderByDataSolicitacaoDescWithAnexos(
                                usuarioAtual.getCampus().getId()
                        )
                        .stream()
                        .map(this::toResponse)
                        .collect(Collectors.toList());
            }

            case COORDENADOR -> {

                results = cursoRepository
                        .findByCoordenadorId(usuarioAtual.getId())
                        .stream()
                        .flatMap(curso ->
                                solicitacaoRepository
                                        .findByCursoIdOrderByDataSolicitacaoDescWithAnexos(
                                                curso.getId()
                                        )
                                        .stream()
                        )
                        .map(this::toResponse)
                        .collect(Collectors.toList());
            }

            case ALUNO -> {

                Aluno aluno = alunoRepository
                        .findByUsuarioId(usuarioAtual.getId())
                        .orElseThrow(() ->
                                new ResourceNotFoundException(
                                        "Aluno",
                                        usuarioAtual.getId()
                                )
                        );

                results = solicitacaoRepository
                        .findByAlunoIdOrderByDataSolicitacaoDescWithAnexos(
                                aluno.getId()
                        )
                        .stream()
                        .map(this::toResponse)
                        .collect(Collectors.toList());
            }

            default -> throw new BusinessRuleException(
                    "Perfil de usuário inválido.",
                    "PERFIL_INVALIDO"
            );
        }

        if (status != null) {

            RequestStatus target;

            try {
                target = RequestStatus.valueOf(
                        status.toUpperCase()
                );
            } catch (IllegalArgumentException e) {
                throw new BusinessRuleException(
                        "Status inválido: " + status,
                        "STATUS_INVALIDO"
                );
            }

            results = results.stream()
                    .filter(r -> r.status() == target)
                    .collect(Collectors.toList());
        }

        return results;
    }

    // =====================================================
    // BUSCAR POR ID
    // =====================================================

    public SolicitacaoResponse buscarPorId(Long id) {

        SolicitacaoHoraComplementar solicitacao =
                solicitacaoRepository.findByIdWithAnexos(id)
                        .orElseThrow(() ->
                                new ResourceNotFoundException(
                                        "Solicitacao",
                                        id
                                )
                        );

        Usuario usuarioAtual = getUsuarioAtual();

        if (!podeAcessarSolicitacao(usuarioAtual, solicitacao)) {
            throw new BusinessRuleException(
                    "Voce não tem permissao para visualizar esta solicitação.",
                    "PERMISSAO_NEGADA"
            );
        }

        return toResponse(solicitacao);
    }

    // =====================================================
    // CRIAR COM ANEXO
    // =====================================================

    @Transactional
    public SolicitacaoResponse criarComAnexo(
            Long tipoHoraId,
            String titulo,
            Integer horasSolicitadas,
            org.springframework.web.multipart.MultipartFile arquivo
    ) {

        Usuario usuarioAtual = getUsuarioAtual();

        if (usuarioAtual.getPerfil() != UserProfile.ALUNO) {
            throw new BusinessRuleException(
                    "Apenas alunos podem criar solicitações.",
                    "PERFIL_INVALIDO"
            );
        }

        /*
         * O aluno é obtido exclusivamente a partir
         * do usuário autenticado.
         */
        Aluno aluno = alunoRepository
                .findByUsuarioId(usuarioAtual.getId())
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Aluno",
                                usuarioAtual.getId()
                        )
                );

        TipoHoraComplementar tipoHora =
                tipoHoraRepository.findById(tipoHoraId)
                        .orElseThrow(() ->
                                new ResourceNotFoundException(
                                        "TipoHoraComplementar",
                                        tipoHoraId
                                )
                        );

        if (!aluno.getCurso().getId().equals(tipoHora.getCurso().getId())) {
            throw new BusinessRuleException(
                    "Aluno não pertence ao curso deste tipo de hora.",
                    "ALUNO_CURSO_MISMATCH"
            );
        }

        validarLimitesCargaHoraria(
                aluno,
                tipoHora,
                horasSolicitadas
        );

        SolicitacaoHoraComplementar solicitacao =
                SolicitacaoHoraComplementar.builder()
                        .aluno(aluno)
                        .tipoHora(tipoHora)
                        .titulo(titulo)
                        .horasSolicitadas(horasSolicitadas)
                        .status(RequestStatus.PENDENTE)
                        .build();

        SolicitacaoHoraComplementar saved =
                solicitacaoRepository.save(solicitacao);

        requestAuditService.registrar(
                saved,
                usuarioAtual,
                "CRIACAO",
                null,
                "PENDENTE",
                "Solicitação criada pelo aluno com anexo: "
                        + (titulo != null ? titulo : "")
        );

        if (arquivo != null && !arquivo.isEmpty()) {

            Path diretorio =
                    Path.of(uploadDir).resolve(
                            String.valueOf(saved.getId())
                    );

            Path caminho = null;

            try {

                String nomeOriginal = arquivo.getOriginalFilename();

                if (nomeOriginal == null || nomeOriginal.isBlank()) {
                    throw new BusinessRuleException(
                            "Nome do arquivo inválido.",
                            "ARQUIVO_INVALIDO"
                    );
                }

                String nomeArquivo =
                        UUID.randomUUID()
                                + "_"
                                + Path.of(nomeOriginal)
                                .getFileName();

                Files.createDirectories(diretorio);

                caminho =
                        diretorio.resolve(nomeArquivo);

                Files.copy(
                        arquivo.getInputStream(),
                        caminho,
                        StandardCopyOption.REPLACE_EXISTING
                );

                String urlRelativo =
                        "/uploads/solicitacoes/"
                                + saved.getId()
                                + "/"
                                + java.net.URLEncoder
                                .encode(
                                        nomeArquivo,
                                        java.nio.charset.StandardCharsets.UTF_8
                                )
                                .replace("+", "%20");

                AnexoSolicitacao anexo =
                        AnexoSolicitacao.builder()
                                .solicitacao(saved)
                                .nomeArquivo(nomeOriginal)
                                .urlArquivo(urlRelativo)
                                .tamanhoBytes(arquivo.getSize())
                                .build();

                anexoSolicitacaoRepository.save(anexo);

                /*
                 * Se a transação for revertida após o retorno do método
                 * (por exemplo, falha no commit), o arquivo já gravado
                 * seria um órfão. Registramos a limpeza para o rollback.
                 */
                registrarLimpezaEmRollback(caminho);

            } catch (IOException e) {

                removerArquivo(caminho, diretorio);

                throw new RuntimeException(
                        "Falha ao salvar arquivo: " + e.getMessage(),
                        e
                );

            } catch (RuntimeException e) {

                removerArquivo(caminho, diretorio);

                throw e;
            }
        }

        publicarSolicitacaoCriada(saved);

        return toResponse(saved);
    }

    /**
     * Registra a remoção do arquivo gravado caso a transação corrente
     * seja revertida (ex.: falha ao persistir o anexo/solicitação no commit).
     */
    private void publicarSolicitacaoCriada(
            SolicitacaoHoraComplementar solicitacao
    ) {
        if (eventPublisher == null) {
            return;
        }
        try {
            eventPublisher.publishEvent(
                    new SolicitacaoCriadaEvent(solicitacao.getId())
            );
        } catch (Exception e) {
            log.error("[EMAIL] Falha ao publicar evento de solicitacao criada id={}: {}",
                    solicitacao.getId(), e.getMessage(), e);
        }
    }

    private void registrarLimpezaEmRollback(Path caminho) {

        if (!TransactionSynchronizationManager.isSynchronizationActive()) {
            return;
        }

        TransactionSynchronizationManager.registerSynchronization(
                new TransactionSynchronization() {
                    @Override
                    public void afterCompletion(int status) {
                        if (status
                                == TransactionSynchronization.STATUS_ROLLED_BACK) {
                            removerArquivo(caminho, caminho.getParent());
                        }
                    }
                }
        );
    }

    /**
     * Remove, em melhor esforço, o arquivo informado e o diretório que o
     * contém caso este fique vazio. Nunca lança exceção, para não mascarar
     * o erro original.
     */
    private void removerArquivo(Path caminho, Path diretorio) {

        try {
            if (caminho != null) {
                Files.deleteIfExists(caminho);
            }

            if (diretorio != null && Files.isDirectory(diretorio)) {
                try (var conteudo = Files.list(diretorio)) {
                    if (conteudo.findAny().isEmpty()) {
                        Files.deleteIfExists(diretorio);
                    }
                }
            }
        } catch (IOException ignored) {
            // limpeza em melhor esforço
        }
    }

    // =====================================================
    // CARGA HORÁRIA
    // =====================================================

    /**
     * Valida os limites de carga horária aplicáveis a uma nova solicitação.
     *
     * <p>O limite do tipo de atividade e o limite do curso são regras de
     * negócio distintas e, por isso, avaliadas separadamente. Em ambos os
     * casos, solicitações DEFERIDAS e PENDENTES reservam horas.</p>
     */
    private void validarLimitesCargaHoraria(
            Aluno aluno,
            TipoHoraComplementar tipoHora,
            Integer novasHoras
    ) {
        validarLimiteTipo(aluno.getId(), tipoHora, novasHoras);
        validarLimiteCurso(aluno, novasHoras);
    }

    /**
     * Soma de horas DEFERIDAS e PENDENTES do aluno para um tipo de atividade
     * não pode ultrapassar a carga horária máxima configurada no tipo.
     */
    private void validarLimiteTipo(
            Long alunoId,
            TipoHoraComplementar tipoHora,
            Integer novasHoras
    ) {

        Integer maximoTipo = tipoHora.getCargaHorariaMaxima();

        if (maximoTipo == null) {
            return;
        }

        int horasDeferidasTipo = normalizar(
                solicitacaoRepository.sumHorasDeferidasByAlunoAndTipoHora(
                        alunoId,
                        tipoHora.getId()
                )
        );

        int horasPendentesTipo = normalizar(
                solicitacaoRepository.sumHorasPendentesByAlunoAndTipoHora(
                        alunoId,
                        tipoHora.getId()
                )
        );

        int totalProjetado =
                horasDeferidasTipo + horasPendentesTipo + novasHoras;

        if (totalProjetado > maximoTipo) {

            throw new BusinessRuleException(
                    String.format(
                            "Aluno ja atingiu/ultrapassou a carga horaria maxima (%d h) para o tipo '%s'.",
                            maximoTipo,
                            tipoHora.getNome()
                    ),
                    "TIPO_HORA_MAXIMA_EXCEDIDA"
            );
        }
    }

    /**
     * Soma de horas DEFERIDAS e PENDENTES do aluno no curso não pode
     * ultrapassar a carga horária exigida configurada no curso.
     */
    private void validarLimiteCurso(Aluno aluno, Integer novasHoras) {

        Curso curso = aluno.getCurso();

        Integer cargaHorariaCurso = curso.getCargaHorariaAcExigida();

        if (cargaHorariaCurso == null) {
            return;
        }

        int horasDeferidasCurso = normalizar(
                solicitacaoRepository.sumHorasDeferidasByAlunoAndCurso(
                        aluno.getId(),
                        curso.getId()
                )
        );

        int horasPendentesCurso = normalizar(
                solicitacaoRepository.sumHorasPendentesByAlunoAndCurso(
                        aluno.getId(),
                        curso.getId()
                )
        );

        int totalProjetado =
                horasDeferidasCurso + horasPendentesCurso + novasHoras;

        if (totalProjetado > cargaHorariaCurso) {

            throw new BusinessRuleException(
                    String.format(
                            "Solicitacao ultrapassaria a carga horaria exigida (%d h) do curso '%s'.",
                            cargaHorariaCurso,
                            curso.getNome()
                    ),
                    "CURSO_CARGA_EXCEDIDA"
            );
        }
    }

    private int normalizar(Integer valor) {
        return valor != null ? valor : 0;
    }

    // =====================================================
    // AUTENTICAÇÃO
    // =====================================================

    private Usuario getUsuarioAtual() {

        Authentication authentication =
                SecurityContextHolder
                        .getContext()
                        .getAuthentication();

        if (authentication == null
                || !authentication.isAuthenticated()
                || "anonymousUser".equals(authentication.getPrincipal())) {

            throw new BusinessRuleException(
                    "Usuário não autenticado.",
                    "UNAUTHENTICATED"
            );
        }

        String loginLdap = authentication.getName();

        return usuarioRepository
                .findByLoginLdapAndAtivoTrue(loginLdap)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Usuario",
                                loginLdap
                        )
                );
    }

    // =====================================================
    // REGRAS DE ACESSO
    // =====================================================

    private boolean podeAcessarSolicitacao(
            Usuario usuario,
            SolicitacaoHoraComplementar solicitacao
    ) {

        return switch (usuario.getPerfil()) {

            case ADMINISTRADOR -> true;

            case ADMIN_CAMPUS -> usuario.getCampus() != null
                    && solicitacao
                    .getAluno()
                    .getCurso()
                    .getCampus()
                    .getId()
                    .equals(
                            usuario.getCampus().getId()
                    );

            case COORDENADOR -> eCoordenadorDoCurso(
                    usuario,
                    solicitacao
                            .getAluno()
                            .getCurso()
                            .getId()
            );

            case ALUNO -> solicitacao
                    .getAluno()
                    .getUsuario()
                    .getId()
                    .equals(usuario.getId());
        };
    }

    private boolean podeAcessarAluno(
            Usuario usuario,
            Aluno aluno
    ) {

        return switch (usuario.getPerfil()) {

            case ADMINISTRADOR -> true;

            case ADMIN_CAMPUS -> usuario.getCampus() != null
                    && aluno.getCurso()
                    .getCampus()
                    .getId()
                    .equals(
                            usuario.getCampus().getId()
                    );

            case COORDENADOR -> eCoordenadorDoCurso(
                    usuario,
                    aluno.getCurso().getId()
            );

            case ALUNO -> aluno.getUsuario()
                    .getId()
                    .equals(usuario.getId());
        };
    }

    private boolean podeAcessarCurso(
            Usuario usuario,
            Long cursoId
    ) {

        return switch (usuario.getPerfil()) {

            case ADMINISTRADOR -> true;

            case ADMIN_CAMPUS -> usuario.getCampus() != null
                    && cursoRepository.findById(cursoId)
                    .map(curso ->
                            curso.getCampus()
                                    .getId()
                                    .equals(
                                            usuario.getCampus().getId()
                                    )
                    )
                    .orElse(false);

            case COORDENADOR -> eCoordenadorDoCurso(
                    usuario,
                    cursoId
            );

            case ALUNO -> alunoRepository.findByUsuarioId(usuario.getId())
                    .map(aluno ->
                            aluno.getCurso()
                                    .getId()
                                    .equals(cursoId)
                    )
                    .orElse(false);
        };
    }

    private boolean podeAcessarCampus(
            Usuario usuario,
            Long campusId
    ) {

        return switch (usuario.getPerfil()) {

            case ADMINISTRADOR -> true;

            case ADMIN_CAMPUS -> usuario.getCampus() != null
                    && usuario.getCampus()
                    .getId()
                    .equals(campusId);

            case COORDENADOR -> cursoRepository
                    .findByCoordenadorId(usuario.getId())
                    .stream()
                    .anyMatch(curso ->
                            curso.getCampus()
                                    .getId()
                                    .equals(campusId)
                    );
            case ALUNO -> alunoRepository
                    .findByUsuarioId(usuario.getId())
                    .map(aluno ->
                            aluno.getCurso()
                                    .getCampus()
                                    .getId()
                                    .equals(campusId)
                    )
                    .orElse(false);
        };
    }

    private boolean eCoordenadorDoCurso(
            Usuario usuario,
            Long cursoId
    ) {

        if (usuario.getPerfil() != UserProfile.COORDENADOR) {
            return false;
        }

        return cursoRepository
                .findByCoordenadorId(usuario.getId())
                .stream()
                .anyMatch(curso ->
                        curso.getId().equals(cursoId)
                );
    }

    // =====================================================
    // RESPONSE
    // =====================================================

    private SolicitacaoResponse toResponse(
            SolicitacaoHoraComplementar s
    ) {

        List<AnexoResponse> anexos =
                s.getAnexos()
                        .stream()
                        .map(a ->
                                new AnexoResponse(
                                        a.getId(),
                                        a.getNomeArquivo(),
                                        a.getUrlArquivo(),
                                        a.getTamanhoBytes()
                                )
                        )
                        .collect(Collectors.toList());

        return new SolicitacaoResponse(
                s.getId(),
                s.getAluno().getMatricula(),
                s.getAluno().getUsuario().getNome(),
                s.getAluno().getCurso().getNome(),
                s.getTipoHora().getNome(),
                s.getTitulo(),
                s.getHorasSolicitadas(),
                s.getHorasDeferidas(),
                s.getStatus(),
                s.getJustificativaCoordenador(),
                s.getCoordenador() != null
                        ? s.getCoordenador().getId()
                        : null,
                s.getCoordenador() != null
                        ? s.getCoordenador().getNome()
                        : null,
                s.getDataSolicitacao(),
                s.getDataAvaliacao(),
                anexos
        );
    }
}
