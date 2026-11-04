package br.edu.ifrs.poa.hcomplementares.service;

import br.edu.ifrs.poa.hcomplementares.dto.request.CursoCreateRequest;
import br.edu.ifrs.poa.hcomplementares.dto.request.CursoUpdateRequest;
import br.edu.ifrs.poa.hcomplementares.dto.response.CursoResponse;
import br.edu.ifrs.poa.hcomplementares.entity.Campus;
import br.edu.ifrs.poa.hcomplementares.entity.Curso;
import br.edu.ifrs.poa.hcomplementares.entity.GrauCurso;
import br.edu.ifrs.poa.hcomplementares.exception.BusinessRuleException;
import br.edu.ifrs.poa.hcomplementares.exception.ResourceConflictException;
import br.edu.ifrs.poa.hcomplementares.exception.ResourceNotFoundException;
import br.edu.ifrs.poa.hcomplementares.entity.Usuario;
import br.edu.ifrs.poa.hcomplementares.enums.UserProfile;
import br.edu.ifrs.poa.hcomplementares.repository.CampusRepository;
import br.edu.ifrs.poa.hcomplementares.repository.CursoRepository;
import br.edu.ifrs.poa.hcomplementares.repository.GrauCursoRepository;
import br.edu.ifrs.poa.hcomplementares.repository.UsuarioRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class CursoService {

    private final CursoRepository cursoRepository;
    private final CampusRepository campusRepository;
    private final GrauCursoRepository grauCursoRepository;
    private final UsuarioRepository usuarioRepository;

    @Transactional
    public CursoResponse criar(CursoCreateRequest request) {
        if (cursoRepository.existsByNomeAndCampusId(request.nome(), request.campusId())) {
            throw new BusinessRuleException("Curso ja existe neste campus: " + request.nome(), "CURSO_ALREADY_EXISTS");
        }
        if (cursoRepository.existsByEmailCoordenacao(request.emailCoordenacao())) {
            throw new ResourceConflictException(
                    "Ja existe um curso com este email de coordenacao.",
                    "EMAIL_COORDENACAO_ALREADY_EXISTS"
            );
        }
        Campus campus = campusRepository.findById(request.campusId())
                .orElseThrow(() -> new ResourceNotFoundException("Campus", request.campusId()));
        GrauCurso grau = grauCursoRepository.findById(request.grauId())
                .orElseThrow(() -> new ResourceNotFoundException("GrauCurso", request.grauId()));
        Curso curso = Curso.builder()
                .nome(request.nome())
                .campus(campus)
                .grau(grau)
                .cargaHorariaAcExigida(request.cargaHorariaAcExigida())
                .emailCoordenacao(request.emailCoordenacao())
                .ativo(true)
                .build();
        Curso saved = cursoRepository.save(curso);
        if (request.coordenadorId() != null) {
            Usuario coordenador = usuarioRepository.findById(request.coordenadorId())
                    .orElseThrow(() -> new ResourceNotFoundException("Usuario", request.coordenadorId()));
            curso.setCoordenador(coordenador);
            saved = cursoRepository.save(curso);
        }
        return toResponse(saved);
    }

    @Transactional
    public CursoResponse atualizar(Long id, CursoUpdateRequest request) {
        Curso curso = cursoRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Curso", id));
        if (request.nome() != null) curso.setNome(request.nome());
        if (request.emailCoordenacao() != null
                && cursoRepository.existsByEmailCoordenacaoAndIdNot(request.emailCoordenacao(), id)) {
            throw new ResourceConflictException(
                    "Ja existe um curso com este email de coordenacao.",
                    "EMAIL_COORDENACAO_ALREADY_EXISTS"
            );
        }
        if (request.emailCoordenacao() != null) curso.setEmailCoordenacao(request.emailCoordenacao());
        if (request.cargaHorariaAcExigida() != null) curso.setCargaHorariaAcExigida(request.cargaHorariaAcExigida());
        if (request.grauId() != null) {
            GrauCurso grau = grauCursoRepository.findById(request.grauId())
                    .orElseThrow(() -> new ResourceNotFoundException("GrauCurso", request.grauId()));
            curso.setGrau(grau);
        }
        if (request.coordenadorId() != null) {
            Usuario coordenador = usuarioRepository.findById(request.coordenadorId())
                    .orElseThrow(() -> new ResourceNotFoundException("Usuario", request.coordenadorId()));
            curso.setCoordenador(coordenador);
        } else {
            curso.setCoordenador(null);
        }
        Curso saved = cursoRepository.save(curso);
        return toResponse(saved);
    }

    @Transactional
    public void desativar(Long id) {
        Curso curso = cursoRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Curso", id));
        curso.setAtivo(false);
        cursoRepository.save(curso);
    }

    public List<CursoResponse> listarTodos(Long userId) {
        Usuario usuario = usuarioRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("Usuario", userId));
        
        if (usuario.getPerfil() == UserProfile.ADMIN_CAMPUS && usuario.getCampus() != null) {
            return cursoRepository.findByCampusId(usuario.getCampus().getId()).stream()
                    .filter(Curso::getAtivo)
                    .map(this::toResponse)
                    .collect(Collectors.toList());
        }
        if (usuario.getPerfil() == UserProfile.ADMINISTRADOR && usuario.getCampus() != null) {
            return cursoRepository.findByCampusId(usuario.getCampus().getId()).stream()
                    .filter(Curso::getAtivo)
                    .map(this::toResponse)
                    .collect(Collectors.toList());
        }
        return cursoRepository.findByAtivoTrueOrderByNomeAsc().stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    public List<CursoResponse> listarPorCampus(Long campusId) {
        return cursoRepository.findByCampusId(campusId).stream()
                .filter(Curso::getAtivo)
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    public CursoResponse buscarPorId(Long id) {
        Curso curso = cursoRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Curso", id));
        return toResponse(curso);
    }

    private CursoResponse toResponse(Curso c) {
        return new CursoResponse(
                c.getId(), c.getCampus().getId(), c.getNome(), c.getCampus().getNome(), c.getCampus().getSigla(),
                c.getGrau() != null ? c.getGrau().getId() : null,
                c.getGrau() != null ? c.getGrau().getNome() : null,
                c.getEmailCoordenacao(), c.getCargaHorariaAcExigida(),
                c.getCoordenador() != null ? c.getCoordenador().getId() : null,
                c.getCoordenador() != null ? c.getCoordenador().getNome() : null,
                c.getAtivo(), c.getCriadoEm());
    }
}
