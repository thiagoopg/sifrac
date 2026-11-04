package br.edu.ifrs.poa.hcomplementares.listener;

import br.edu.ifrs.poa.hcomplementares.config.MailProperties;
import br.edu.ifrs.poa.hcomplementares.event.SolicitacaoAvaliadaEvent;
import br.edu.ifrs.poa.hcomplementares.service.EmailService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Component;
import org.springframework.transaction.event.TransactionPhase;
import org.springframework.transaction.event.TransactionalEventListener;
import org.thymeleaf.context.Context;

@Slf4j
@Component
@RequiredArgsConstructor
public class AvaliacaoAlunoListener {

    private final EmailService emailService;
    private final MailProperties mailProperties;

    @Async("mailTaskExecutor")
    @TransactionalEventListener(phase = TransactionPhase.AFTER_COMMIT)
    public void onSolicitacaoAvaliada(SolicitacaoAvaliadaEvent event) {
        if (!mailProperties.avaliacaoAlunoHabilitada()) {
            log.debug("[EMAIL] app.mail.avaliacao-aluno-enabled=false. Ignorando envio para aluno.");
            return;
        }
        try {
            Context context = new Context();
            context.setVariable("alunoNome", event.alunoNome());
            context.setVariable("solicitacaoTitulo", event.solicitacaoTitulo());
            context.setVariable("cursoNome", event.cursoNome());
            context.setVariable("tipoHoraNome", event.tipoHoraNome());
            context.setVariable("horasSolicitadas", event.horasSolicitadas());
            context.setVariable("horasDeferidas", event.horasDeferidas());
            context.setVariable("justificativaCoordenador", event.justificativaCoordenador());
            context.setVariable("status", event.novoStatus().name());
            context.setVariable("coordenadorNome", event.coordenadorNome());

            String assunto = "Sua solicitacao '" + event.solicitacaoTitulo() + "' foi "
                    + event.novoStatus().name();
            emailService.enviarAvaliacaoAluno(event.alunoEmail(), assunto, context);
            log.info("[EMAIL] Evento avaliado processado para solicitacaoId={}", event.solicitacaoId());
        } catch (Exception e) {
            log.error("[EMAIL] Erro ao processar evento de avaliacao para solicitacaoId={}: {}",
                    event.solicitacaoId(), e.getMessage(), e);
        }
    }
}
