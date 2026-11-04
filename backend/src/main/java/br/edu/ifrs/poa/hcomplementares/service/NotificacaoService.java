package br.edu.ifrs.poa.hcomplementares.service;

import br.edu.ifrs.poa.hcomplementares.dto.response.NotificacaoResponse;
import br.edu.ifrs.poa.hcomplementares.entity.Notificacao;
import br.edu.ifrs.poa.hcomplementares.entity.Usuario;
import br.edu.ifrs.poa.hcomplementares.entity.SolicitacaoHoraComplementar;
import br.edu.ifrs.poa.hcomplementares.enums.RequestStatus;
import br.edu.ifrs.poa.hcomplementares.repository.NotificacaoRepository;
import br.edu.ifrs.poa.hcomplementares.repository.UsuarioRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class NotificacaoService {

    private final NotificacaoRepository notificacaoRepository;
    private final UsuarioRepository usuarioRepository;

    public List<NotificacaoResponse> listarPorUsuario(Long usuarioId) {
        return notificacaoRepository.findByUsuarioIdOrderByCriadoEmDesc(usuarioId).stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    public long contarNaoLidas(Long usuarioId) {
        return notificacaoRepository.countByUsuarioIdAndLidaFalse(usuarioId);
    }

    @Transactional
    public NotificacaoResponse marcarComoLida(Long notificacaoId, Long usuarioId) {
        Notificacao notificacao = notificacaoRepository.findById(notificacaoId)
                .orElseThrow(() -> new RuntimeException("Notificacao nao encontrada"));
        if (!notificacao.getUsuario().getId().equals(usuarioId)) {
            throw new RuntimeException("Nao possui permissao para esta notificacao");
        }
        notificacao.setLida(true);
        Notificacao saved = notificacaoRepository.save(notificacao);
        return toResponse(saved);
    }

    @Transactional
    public void marcarTodasComoLidas(Long usuarioId) {
        List<Notificacao> naoLidas = notificacaoRepository.findByUsuarioIdAndLidaFalseOrderByCriadoEmDesc(usuarioId);
        naoLidas.forEach(n -> n.setLida(true));
        notificacaoRepository.saveAll(naoLidas);
    }

    @Transactional
    public NotificacaoResponse criar(SolicitacaoHoraComplementar solicitacao, RequestStatus novoStatus, Usuario coordenador) {
        Usuario aluno = solicitacao.getAluno().getUsuario();
        String titulo;
        String mensagem;

        if (novoStatus == RequestStatus.DEFERIDO) {
            titulo = "Solicitação aprovada!";
            mensagem = String.format(
                    "Sua solicitação de \"%s\" foi deferida. Foram concordadas %d horas.",
                    solicitacao.getTipoHora().getNome(),
                    solicitacao.getHorasDeferidas()
            );
        } else if (novoStatus == RequestStatus.INDEFERIDO) {
            titulo = "Solicitação rejeitada";
            mensagem = String.format(
                    "Sua solicitação de \"%s\" foi rejeitada. Verifique a justificativa na solicitação.",
                    solicitacao.getTipoHora().getNome()
            );
        } else {
            return null;
        }

        Notificacao notificacao = Notificacao.builder()
                .usuario(aluno)
                .solicitacao(solicitacao)
                .titulo(titulo)
                .mensagem(mensagem)
                .lida(false)
                .enviadaPorEmail(false)
                .build();

        Notificacao saved = notificacaoRepository.save(notificacao);
        return toResponse(saved);
    }

    private NotificacaoResponse toResponse(Notificacao n) {
        return new NotificacaoResponse(
                n.getId(),
                n.getUsuario().getId(),
                n.getTitulo(),
                n.getMensagem(),
                n.getLida(),
                n.getSolicitacao() != null ? n.getSolicitacao().getId() : null,
                n.getCriadoEm()
        );
    }
}
