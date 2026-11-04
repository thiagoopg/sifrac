package br.edu.ifrs.poa.hcomplementares.entity;

import br.edu.ifrs.poa.hcomplementares.enums.RequestStatus;
import jakarta.persistence.*;
import lombok.*;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "solicitacao_hora_complementar")
@EntityListeners(AuditingEntityListener.class)
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SolicitacaoHoraComplementar {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "aluno_id", nullable = false)
    private Aluno aluno;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "tipo_hora_id", nullable = false)
    private TipoHoraComplementar tipoHora;

    @Column(name = "horas_solicitadas", nullable = false)
    @Builder.Default
    private Integer horasSolicitadas = 0;

    @Column(name = "titulo", length = 255)
    private String titulo;

    @Column(name = "horas_deferidas")
    private Integer horasDeferidas;

    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false, length = 20)
    @Builder.Default
    private RequestStatus status = RequestStatus.PENDENTE;

    @Column(name = "justificativa_coordenador", length = 1000)
    private String justificativaCoordenador;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "coordenador_id")
    private Usuario coordenador;

    @CreatedDate
    @Column(name = "data_solicitacao", nullable = false, updatable = false)
    private LocalDateTime dataSolicitacao;

    @Column(name = "data_avaliacao")
    private LocalDateTime dataAvaliacao;

    @OneToMany(mappedBy = "solicitacao", fetch = FetchType.LAZY)
    @Builder.Default
    private List<AnexoSolicitacao> anexos = new ArrayList<>();

    @OneToMany(mappedBy = "solicitacao", fetch = FetchType.LAZY)
    @Builder.Default
    private List<Notificacao> notificacoes = new ArrayList<>();
}
