package br.edu.ifrs.poa.hcomplementares.service;

import br.edu.ifrs.poa.hcomplementares.dto.request.AlunoCreateRequest;
import br.edu.ifrs.poa.hcomplementares.dto.response.AlunoResponse;
import br.edu.ifrs.poa.hcomplementares.entity.Aluno;
import br.edu.ifrs.poa.hcomplementares.entity.Curso;
import br.edu.ifrs.poa.hcomplementares.entity.Usuario;
import br.edu.ifrs.poa.hcomplementares.exception.BusinessRuleException;
import br.edu.ifrs.poa.hcomplementares.exception.ResourceNotFoundException;
import br.edu.ifrs.poa.hcomplementares.repository.AlunoRepository;
import br.edu.ifrs.poa.hcomplementares.repository.CursoRepository;
import br.edu.ifrs.poa.hcomplementares.repository.UsuarioRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class AlunoService {

    private final AlunoRepository alunoRepository;
    private final UsuarioRepository usuarioRepository;
    private final CursoRepository cursoRepository;

    @Transactional
    public AlunoResponse criar(AlunoCreateRequest request) {
        if (alunoRepository.existsByMatricula(request.matricula())) {
            throw new BusinessRuleException("Matricula ja cadastrada: " + request.matricula(), "MATRICULA_ALREADY_EXISTS");
        }
        Usuario usuario = usuarioRepository.findById(request.usuarioId())
                .orElseThrow(() -> new ResourceNotFoundException("Usuario", request.usuarioId()));
        Curso curso = cursoRepository.findById(request.cursoId())
                .orElseThrow(() -> new ResourceNotFoundException("Curso", request.cursoId()));
        Aluno aluno = Aluno.builder()
                .usuario(usuario)
                .curso(curso)
                .matricula(request.matricula())
                .build();
        Aluno saved = alunoRepository.save(aluno);
        return toResponse(saved);
    }

    public List<AlunoResponse> listarTodos() {
        return alunoRepository.findAll().stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    public List<AlunoResponse> listarPorCurso(Long cursoId) {
        if (!cursoRepository.existsById(cursoId)) {
            throw new ResourceNotFoundException("Curso", cursoId);
        }
        return alunoRepository.findAll().stream()
                .filter(a -> a.getCurso().getId().equals(cursoId))
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    public AlunoResponse buscarPorMatricula(String matricula) {
        Aluno aluno = alunoRepository.findByMatricula(matricula)
                .orElseThrow(() -> new ResourceNotFoundException("Aluno", matricula));
        return toResponse(aluno);
    }

    public AlunoResponse buscarPorId(Long id) {
        Aluno aluno = alunoRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Aluno", id));
        return toResponse(aluno);
    }

    public AlunoResponse buscarPorUsuarioId(Long usuarioId) {
        Aluno aluno = alunoRepository.findByUsuarioId(usuarioId)
                .orElseThrow(() -> new ResourceNotFoundException("Aluno", usuarioId));
        return toResponse(aluno);
    }

    public Map<String, Integer> calcularHorasDeferredasPorTipo(Long alunoId) {
        Aluno aluno = alunoRepository.findById(alunoId)
                .orElseThrow(() -> new ResourceNotFoundException("Aluno", alunoId));
        return aluno.getSolicitacoes().stream()
                .filter(s -> s.getStatus().name().equals("DEFERIDO"))
                .collect(Collectors.groupingBy(
                        s -> s.getTipoHora().getNome(),
                        Collectors.summingInt(s -> s.getHorasDeferidas() != null ? s.getHorasDeferidas() : 0)
                ));
    }

    private AlunoResponse toResponse(Aluno a) {
        return new AlunoResponse(a.getId(), a.getMatricula(),
                a.getUsuario().getNome(), a.getUsuario().getEmail(),
                a.getCurso().getNome(), a.getCriadoEm());
    }
}
