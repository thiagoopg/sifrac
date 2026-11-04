package br.edu.ifrs.poa.hcomplementares.config;

import br.edu.ifrs.poa.hcomplementares.entity.*;
import br.edu.ifrs.poa.hcomplementares.enums.RequestStatus;
import br.edu.ifrs.poa.hcomplementares.enums.UserProfile;
import br.edu.ifrs.poa.hcomplementares.repository.AlunoRepository;
import br.edu.ifrs.poa.hcomplementares.repository.CampusRepository;
import br.edu.ifrs.poa.hcomplementares.repository.CursoRepository;
import br.edu.ifrs.poa.hcomplementares.repository.GrauCursoRepository;
import br.edu.ifrs.poa.hcomplementares.repository.SolicitacaoRepository;
import br.edu.ifrs.poa.hcomplementares.repository.TipoHoraComplementarRepository;
import br.edu.ifrs.poa.hcomplementares.repository.UsuarioRepository;
import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;

@Component
@RequiredArgsConstructor
public class DataLoader {

    private final CampusRepository campusRepository;
    private final GrauCursoRepository grauCursoRepository;
    private final CursoRepository cursoRepository;
    private final UsuarioRepository usuarioRepository;
    private final AlunoRepository alunoRepository;
    private final TipoHoraComplementarRepository tipoHoraRepository;
    private final SolicitacaoRepository solicitacaoRepository;

    @PostConstruct
    public void load() {
        if (!campusRepository.findAll().isEmpty()) return;

        LocalDateTime now = LocalDateTime.now();

        // Graus
        GrauCurso gradTecnologico = GrauCurso.builder().nome("Tecnológico").descricao("Curso de tecnologia").ativo(true).criadoEm(now).build();
        GrauCurso gradBacharelado = GrauCurso.builder().nome("Bacharelado").descricao("Bacharelado").ativo(true).criadoEm(now).build();
        grauCursoRepository.save(gradTecnologico);
        grauCursoRepository.save(gradBacharelado);

        // Campus
        Campus poa = Campus.builder().nome("Porto Alegre").sigla("POA").cidade("Porto Alegre").uf("RS").ativo(true).criadoEm(now).build();
        Campus npoa = Campus.builder().nome("Nova Porto Alegre").sigla("NPOA").cidade("Nova Porto Alegre").uf("RS").ativo(true).criadoEm(now).build();
        Campus farroupilha = Campus.builder().nome("Farroupilha").sigla("FAR").cidade("Farroupilha").uf("RS").ativo(true).criadoEm(now).build();
        campusRepository.save(poa);
        campusRepository.save(npoa);
        campusRepository.save(farroupilha);

        // Usuários
        Usuario admin = Usuario.builder().nome("Administrador do Sistema").email("admin@ifrs.edu.br").loginLdap("admin").perfil(UserProfile.ADMINISTRADOR).ativo(true).criadoEm(now).build();
        Usuario coordenador = Usuario.builder().nome("Marcelo Augusto Rauh Schmitt").email("marceloschmitt@ifrs.edu.br").loginLdap("marceloschmitt").perfil(UserProfile.COORDENADOR).ativo(true).criadoEm(now).build();
        Usuario aluno1 = Usuario.builder().nome("Thiago Adriel Oliveira de Lima").email("thiagolima@ifrs.edu.br").loginLdap("thiagolima").perfil(UserProfile.ALUNO).ativo(true).criadoEm(now).build();
        Usuario aluno2 = Usuario.builder().nome("Maria Silva Santos").email("mariasilva@ifrs.edu.br").loginLdap("mariasilva").perfil(UserProfile.ALUNO).ativo(true).criadoEm(now).build();
        Usuario aluno3 = Usuario.builder().nome("João Pedro Costa").email("joaopedro@ifrs.edu.br").loginLdap("joaopedro").perfil(UserProfile.ALUNO).ativo(true).criadoEm(now).build();
        usuarioRepository.save(admin);
        usuarioRepository.save(coordenador);
        usuarioRepository.save(aluno1);
        usuarioRepository.save(aluno2);
        usuarioRepository.save(aluno3);

        // Cursos
        Curso tads = cursoRepository.save(Curso.builder().campus(poa).grau(gradTecnologico).nome("Tecnologia em Análise e Desenvolvimento de Sistemas").cargaHorariaAcExigida(180).emailCoordenacao("tads.coordenacao@ifrs.edu.br").coordenador(coordenador).ativo(true).criadoEm(now).build());
        Curso tgti = cursoRepository.save(Curso.builder().campus(poa).grau(gradTecnologico).nome("Tecnologia em Gestão de Tecnologia da Informação").cargaHorariaAcExigida(120).emailCoordenacao("tgti.coordenacao@ifrs.edu.br").coordenador(coordenador).ativo(true).criadoEm(now).build());
        Curso trc = cursoRepository.save(Curso.builder().campus(npoa).grau(gradTecnologico).nome("Tecnologia em Redes de Computadores").cargaHorariaAcExigida(160).emailCoordenacao("trc.coordenacao@ifrs.edu.br").coordenador(null).ativo(true).criadoEm(now).build());
        Curso spi = cursoRepository.save(Curso.builder().campus(poa).grau(gradTecnologico).nome("Tecnologia em Sistemas para Internet").cargaHorariaAcExigida(180).emailCoordenacao("spi.coordenacao@ifrs.edu.br").coordenador(coordenador).ativo(true).criadoEm(now).build());
        Curso sbads = cursoRepository.save(Curso.builder().campus(farroupilha).grau(gradBacharelado).nome("Bacharelado em Análise e Desenvolvimento de Sistemas").cargaHorariaAcExigida(240).emailCoordenacao("sbads.coordenacao@ifrs.edu.br").coordenador(null).ativo(true).criadoEm(now).build());

        // Alunos
        Aluno thomas = alunoRepository.save(Aluno.builder().usuario(aluno1).curso(spi).matricula("2024101001").build());
        Aluno maria = alunoRepository.save(Aluno.builder().usuario(aluno2).curso(spi).matricula("2024101002").build());
        Aluno joao = alunoRepository.save(Aluno.builder().usuario(aluno3).curso(tads).matricula("2024101003").build());

        // Tipos de Hora para SPI
        TipoHoraComplementar extensaoSpi = tipoHoraRepository.save(TipoHoraComplementar.builder().curso(spi).nome("Curso de Extensão").descricao("Cursos de extensão e atualização").cargaHorariaMaxima(60).ativo(true).criadoEm(now).build());
        TipoHoraComplementar eventosSpi = tipoHoraRepository.save(TipoHoraComplementar.builder().curso(spi).nome("Participação em Eventos").descricao("Eventos acadêmicos e técnicos").cargaHorariaMaxima(40).ativo(true).criadoEm(now).build());
        TipoHoraComplementar pesquisaSpi = tipoHoraRepository.save(TipoHoraComplementar.builder().curso(spi).nome("Projeto de Pesquisa").descricao("Projetos de pesquisa e iniciação científica").cargaHorariaMaxima(80).ativo(true).criadoEm(now).build());
        TipoHoraComplementar monitoriaSpi = tipoHoraRepository.save(TipoHoraComplementar.builder().curso(spi).nome("Monitoria").descricao("Monitoria de disciplinas").cargaHorariaMaxima(60).ativo(true).criadoEm(now).build());

        // Tipos de Hora para TADS
        TipoHoraComplementar extensaoTads = tipoHoraRepository.save(TipoHoraComplementar.builder().curso(tads).nome("Curso de Extensão").descricao("Cursos de extensão").cargaHorariaMaxima(60).ativo(true).criadoEm(now).build());
        TipoHoraComplementar eventosTads = tipoHoraRepository.save(TipoHoraComplementar.builder().curso(tads).nome("Participação em Eventos").descricao("Eventos acadêmicos").cargaHorariaMaxima(40).ativo(true).criadoEm(now).build());

        // Solicitações
        SolicitacaoHoraComplementar sol1 = solicitacaoRepository.save(SolicitacaoHoraComplementar.builder().aluno(thomas).tipoHora(extensaoSpi).horasSolicitadas(40).horasDeferidas(40).status(RequestStatus.DEFERIDO).justificativaCoordenador("Curso de extensão em Java EE aprovado. Carga horária compatível.").coordenador(coordenador).dataSolicitacao(LocalDateTime.of(2026,8,15,10,0)).dataAvaliacao(LocalDateTime.of(2026,8,20,14,30)).build());
        SolicitacaoHoraComplementar sol2 = solicitacaoRepository.save(SolicitacaoHoraComplementar.builder().aluno(thomas).tipoHora(eventosSpi).horasSolicitadas(20).horasDeferidas(null).status(RequestStatus.PENDENTE).justificativaCoordenador(null).coordenador(null).dataSolicitacao(LocalDateTime.of(2026,9,1,9,0)).dataAvaliacao(null).build());
        SolicitacaoHoraComplementar sol3 = solicitacaoRepository.save(SolicitacaoHoraComplementar.builder().aluno(maria).tipoHora(pesquisaSpi).horasSolicitadas(30).horasDeferidas(30).status(RequestStatus.INDEFERIDO).justificativaCoordenador("Documentação insuficiente para o projeto.").coordenador(coordenador).dataSolicitacao(LocalDateTime.of(2026,8,10,8,0)).dataAvaliacao(LocalDateTime.of(2026,8,15,10,0)).build());
        SolicitacaoHoraComplementar sol4 = solicitacaoRepository.save(SolicitacaoHoraComplementar.builder().aluno(maria).tipoHora(extensaoSpi).horasSolicitadas(20).horasDeferidas(null).status(RequestStatus.PENDENTE).justificativaCoordenador(null).coordenador(null).dataSolicitacao(LocalDateTime.of(2026,9,5,14,0)).dataAvaliacao(null).build());
        SolicitacaoHoraComplementar sol5 = solicitacaoRepository.save(SolicitacaoHoraComplementar.builder().aluno(joao).tipoHora(extensaoTads).horasSolicitadas(30).horasDeferidas(30).status(RequestStatus.DEFERIDO).justificativaCoordenador("Aprovado pelo colegiado do curso.").coordenador(coordenador).dataSolicitacao(LocalDateTime.of(2026,7,20,9,0)).dataAvaliacao(LocalDateTime.of(2026,7,25,11,0)).build());
        SolicitacaoHoraComplementar sol6 = solicitacaoRepository.save(SolicitacaoHoraComplementar.builder().aluno(joao).tipoHora(eventosTads).horasSolicitadas(10).horasDeferidas(null).status(RequestStatus.PENDENTE).justificativaCoordenador(null).coordenador(null).dataSolicitacao(LocalDateTime.of(2026,9,8,16,0)).dataAvaliacao(null).build());
    }
}
