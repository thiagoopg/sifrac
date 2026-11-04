package br.edu.ifrs.poa.hcomplementares.listener;

import br.edu.ifrs.poa.hcomplementares.event.SolicitacaoCriadaEvent;
import br.edu.ifrs.poa.hcomplementares.service.EmailResumoPendenciasService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Component;
import org.springframework.transaction.event.TransactionPhase;
import org.springframework.transaction.event.TransactionalEventListener;

@Slf4j
@Component
@RequiredArgsConstructor
public class ResumoPendenciasListener {

    private final EmailResumoPendenciasService emailResumoPendenciasService;

    @Async("mailTaskExecutor")
    @TransactionalEventListener(phase = TransactionPhase.AFTER_COMMIT)
    public void onSolicitacaoCriada(SolicitacaoCriadaEvent event) {
        try {
            emailResumoPendenciasService.processar(event.solicitacaoId());
        } catch (Exception e) {
            log.error("[EMAIL] Erro ao processar resumo de pendencias para solicitacaoId={}: {}",
                    event.solicitacaoId(), e.getMessage(), e);
        }
    }
}
