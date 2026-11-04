package br.edu.ifrs.poa.hcomplementares.entity;

import jakarta.persistence.*;
import lombok.*;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.time.LocalDateTime;

@Entity
@Table(name = "anexo_solicitacao")
@EntityListeners(AuditingEntityListener.class)
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AnexoSolicitacao {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "solicitacao_id", nullable = false)
    private SolicitacaoHoraComplementar solicitacao;

    @Column(name = "nome_arquivo", nullable = false, length = 255)
    private String nomeArquivo;

    @Column(name = "url_arquivo", nullable = false, length = 1000)
    private String urlArquivo;

    @Column(name = "tamanho_bytes")
    private Long tamanhoBytes;

    @CreatedDate
    @Column(name = "enviado_em", nullable = false, updatable = false)
    private LocalDateTime enviadoEm;
}
