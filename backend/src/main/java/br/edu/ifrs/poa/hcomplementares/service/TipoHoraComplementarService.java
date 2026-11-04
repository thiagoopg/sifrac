package br.edu.ifrs.poa.hcomplementares.service;

import br.edu.ifrs.poa.hcomplementares.dto.request.TipoHoraCreateRequest;
import br.edu.ifrs.poa.hcomplementares.dto.request.TipoHoraUpdateRequest;
import br.edu.ifrs.poa.hcomplementares.dto.response.TipoHoraResponse;
import br.edu.ifrs.poa.hcomplementares.entity.Curso;
import br.edu.ifrs.poa.hcomplementares.entity.TipoHoraComplementar;
import br.edu.ifrs.poa.hcomplementares.exception.BusinessRuleException;
import br.edu.ifrs.poa.hcomplementares.exception.ResourceNotFoundException;
import br.edu.ifrs.poa.hcomplementares.repository.CursoRepository;
import br.edu.ifrs.poa.hcomplementares.repository.TipoHoraComplementarRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class TipoHoraComplementarService {

    private final TipoHoraComplementarRepository tipoHoraRepository;
    private final CursoRepository cursoRepository;

    @Transactional
    public TipoHoraResponse criar(TipoHoraCreateRequest request) {
        Curso curso = cursoRepository.findById(request.cursoId())
                .orElseThrow(() -> new ResourceNotFoundException("Curso", request.cursoId()));
        if (tipoHoraRepository.existsByCursoIdAndNome(request.cursoId(), request.nome())) {
            throw new BusinessRuleException("Tipo de hora ja existe neste curso: " + request.nome(), "TIPO_HORA_ALREADY_EXISTS");
        }
        TipoHoraComplementar tipo = TipoHoraComplementar.builder()
                .nome(request.nome())
                .descricao(request.descricao())
                .cargaHorariaMaxima(request.cargaHorariaMaxima())
                .curso(curso)
                .ativo(true)
                .build();
        TipoHoraComplementar saved = tipoHoraRepository.save(tipo);
        return toResponse(saved);
    }

    @Transactional
    public TipoHoraResponse atualizar(Long id, TipoHoraUpdateRequest request) {
        TipoHoraComplementar tipo = tipoHoraRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("TipoHoraComplementar", id));
        if (request.nome() != null) tipo.setNome(request.nome());
        if (request.descricao() != null) tipo.setDescricao(request.descricao());
        if (request.cargaHorariaMaxima() != null) tipo.setCargaHorariaMaxima(request.cargaHorariaMaxima());
        TipoHoraComplementar saved = tipoHoraRepository.save(tipo);
        return toResponse(saved);
    }

    @Transactional
    public void desativar(Long id) {
        TipoHoraComplementar tipo = tipoHoraRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("TipoHoraComplementar", id));
        tipo.setAtivo(false);
        tipoHoraRepository.save(tipo);
    }

    public List<TipoHoraResponse> listarTodos() {
        return tipoHoraRepository.findAll().stream()
                .filter(TipoHoraComplementar::getAtivo)
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    public List<TipoHoraResponse> listarPorCurso(Long cursoId) {
        if (!cursoRepository.existsById(cursoId)) {
            throw new ResourceNotFoundException("Curso", cursoId);
        }
        return tipoHoraRepository.findByCursoId(cursoId).stream()
                .filter(TipoHoraComplementar::getAtivo)
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    public List<TipoHoraResponse> listarPorCampus(Long campusId) {
        return tipoHoraRepository.findByCursoCampusId(campusId).stream()
                .filter(TipoHoraComplementar::getAtivo)
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    public TipoHoraResponse buscarPorId(Long id) {
        TipoHoraComplementar tipo = tipoHoraRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("TipoHoraComplementar", id));
        return toResponse(tipo);
    }

    private TipoHoraResponse toResponse(TipoHoraComplementar t) {
        return new TipoHoraResponse(
                t.getId(), t.getNome(), t.getDescricao(), t.getCargaHorariaMaxima(),
                t.getCurso().getNome(), t.getCurso().getId(), t.getAtivo(), t.getCriadoEm());
    }
}
