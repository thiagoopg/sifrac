package br.edu.ifrs.poa.hcomplementares.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;
import java.time.LocalDateTime;

/**
 * Registra a ultima quantidade de solicitacoes pendentes que gerou
 * envio de resumo por e-mail para um coordenador em uma data.
 */
@Entity
@Table(
        name = "coordenador_notificacao_pendencia",
        uniqueConstraints = @UniqueConstraint(
                name = "uk_coord_notif_data",
                columnNames = {"coordenador_id", "data_referencia"}
        )
)
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CoordenadorNotificacaoPendencia {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "coordenador_id", nullable = false)
    private Usuario coordenador;

    @Column(name = "data_referencia", nullable = false)
    private LocalDate dataReferencia;

    @Column(name = "ultima_quantidade_enviada", nullable = false)
    private Integer ultimaQuantidadeEnviada;

    @Column(name = "enviado_em", nullable = false)
    private LocalDateTime enviadoEm;
}
