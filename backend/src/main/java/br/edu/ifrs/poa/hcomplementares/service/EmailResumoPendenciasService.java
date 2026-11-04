package br.edu.ifrs.poa.hcomplementares.service;

import br.edu.ifrs.poa.hcomplementares.config.MailProperties;
import br.edu.ifrs.poa.hcomplementares.entity.CoordenadorNotificacaoPendencia;
import br.edu.ifrs.poa.hcomplementares.entity.Curso;
import br.edu.ifrs.poa.hcomplementares.entity.SolicitacaoHoraComplementar;
import br.edu.ifrs.poa.hcomplementares.entity.Usuario;
import br.edu.ifrs.poa.hcomplementares.enums.RequestStatus;
import br.edu.ifrs.poa.hcomplementares.repository.CoordenadorNotificacaoPendenciaRepository;
import br.edu.ifrs.poa.hcomplementares.repository.SolicitacaoRepository;
import br.edu.ifrs.poa.hcomplementares.repository.SolicitacaoRepository.PendenciaPorCurso;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.thymeleaf.context.Context;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

/**
 * Envia resumo de pendencias ao coordenador.
 * Regra: so envia quando o total atual supera o ultimo envio.
 * Isso evita spam enquanto nada novo chega.
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class EmailResumoPendenciasService {

    private static final DateTimeFormatter FORMATO_DATA =
            DateTimeFormatter.ofPattern("dd/MM/yyyy");

    private final SolicitacaoRepository solicitacaoRepository;
    private final CoordenadorNotificacaoPendenciaRepository notificacaoRepository;
    private final EmailService emailService;
    private final MailProperties mailProperties;

    @Transactional
    public void processar(Long solicitacaoId) {

        if (!mailProperties.resumoPendenciasHabilitado()) {
            log.debug("[EMAIL] app.mail.resumo-pendencias-enabled=false. Ignorando resumo.");
            return;
        }

        SolicitacaoHoraComplementar solicitacao =
                solicitacaoRepository.findById(solicitacaoId).orElse(null);

        if (solicitacao == null) {
            log.warn("[EMAIL] Solicitacao {} nao encontrada para o resumo de pendencias.", solicitacaoId);
            return;
        }

        Curso curso = solicitacao.getAluno() != null
                ? solicitacao.getAluno().getCurso()
                : null;
        Usuario coordenador = curso != null ? curso.getCoordenador() : null;

        if (coordenador == null) {
            log.warn("[EMAIL] Curso {} sem coordenador vinculado. Resumo nao enviado.",
                    curso != null ? curso.getNome() : "desconhecido");
            return;
        }

        List<PendenciaPorCurso> pendencias =
                solicitacaoRepository.contarPendenciasPorCursoDoCoordenador(
                        coordenador.getId(),
                        RequestStatus.PENDENTE
                );

        long total = pendencias.stream()
                .mapToLong(PendenciaPorCurso::getQuantidade)
                .sum();

        long ultimaQuantidade = notificacaoRepository
                .findFirstByCoordenadorIdOrderByDataReferenciaDesc(coordenador.getId())
                .map(CoordenadorNotificacaoPendencia::getUltimaQuantidadeEnviada)
                .orElse(0);

        if (total == 0 || total <= ultimaQuantidade) {
            log.debug("[EMAIL] Resumo nao enviado para coordenador {}: atual={} ultimaEnviada={}",
                    coordenador.getLoginLdap(), total, ultimaQuantidade);
            return;
        }

        Map<String, Long> pendenciasPorCurso = new LinkedHashMap<>();
        pendencias.forEach(p -> pendenciasPorCurso.put(p.getCursoNome(), p.getQuantidade()));

        Context context = new Context();
        context.setVariable("coordenadorNome", coordenador.getNome());
        context.setVariable("totalPendencias", total);
        context.setVariable("pendenciasPorCurso", pendenciasPorCurso);
        context.setVariable("dataReferencia", LocalDate.now().format(FORMATO_DATA));

        String assunto = "Resumo de pendencias: " + total
                + (total == 1 ? " solicitacao aguardando avaliacao" : " solicitacoes aguardando avaliacao");

        boolean enviado = emailService.enviarResumoPendencias(
                coordenador.getEmail(),
                assunto,
                context
        );

        if (!enviado) {
            log.warn("[EMAIL] Resumo de pendencias nao registrado para coordenador {} porque o envio falhou.",
                    coordenador.getLoginLdap());
            return;
        }

        registrarEnvio(coordenador, total);
    }

    private void registrarEnvio(Usuario coordenador, long total) {
        LocalDate hoje = LocalDate.now();

        // Atualiza registro do dia ou cria um novo
        CoordenadorNotificacaoPendencia registro = notificacaoRepository
                .findByCoordenadorIdAndDataReferencia(coordenador.getId(), hoje)
                .orElseGet(() -> CoordenadorNotificacaoPendencia.builder()
                        .coordenador(coordenador)
                        .dataReferencia(hoje)
                        .build());

        registro.setUltimaQuantidadeEnviada((int) total);
        registro.setEnviadoEm(LocalDateTime.now());
        notificacaoRepository.save(registro);
    }
}
