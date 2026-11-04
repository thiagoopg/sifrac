package br.edu.ifrs.poa.hcomplementares.service;

import br.edu.ifrs.poa.hcomplementares.dto.response.GrauCursoResponse;
import br.edu.ifrs.poa.hcomplementares.repository.GrauCursoRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class GrauCursoService {

    private final GrauCursoRepository grauCursoRepository;

    public List<GrauCursoResponse> listarAtivos() {
        return grauCursoRepository.findByAtivoTrueOrderByNomeAsc().stream()
                .map(g -> new GrauCursoResponse(g.getId(), g.getNome(), g.getDescricao()))
                .toList();
    }
}
