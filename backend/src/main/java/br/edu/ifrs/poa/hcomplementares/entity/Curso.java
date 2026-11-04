package br.edu.ifrs.poa.hcomplementares.entity;

import jakarta.persistence.*;
import lombok.*;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "curso")
@EntityListeners(AuditingEntityListener.class)
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Curso {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "campus_id", nullable = false)
    private Campus campus;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "grau_id", nullable = false)
    private GrauCurso grau;

    @Column(name = "nome", nullable = false, length = 150)
    private String nome;

    @Column(name = "carga_horaria_ac_exigida", nullable = false)
    @Builder.Default
    private Integer cargaHorariaAcExigida = 0;

    @Column(name = "email_coordenacao", nullable = false, unique = true, length = 150)
    private String emailCoordenacao;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "coordenador_id")
    private Usuario coordenador;

    @Column(name = "ativo", nullable = false)
    @Builder.Default
    private Boolean ativo = true;

    @CreatedDate
    @Column(name = "criado_em", nullable = false, updatable = false)
    private LocalDateTime criadoEm;

    @OneToMany(mappedBy = "curso", fetch = FetchType.LAZY)
    @Builder.Default
    private List<TipoHoraComplementar> tiposHora = new ArrayList<>();

    @OneToMany(mappedBy = "curso", fetch = FetchType.LAZY)
    @Builder.Default
    private List<Aluno> alunos = new ArrayList<>();
}
