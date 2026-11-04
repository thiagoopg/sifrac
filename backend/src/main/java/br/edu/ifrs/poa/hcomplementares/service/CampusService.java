package br.edu.ifrs.poa.hcomplementares.service;

import br.edu.ifrs.poa.hcomplementares.dto.request.CampusCreateRequest;
import br.edu.ifrs.poa.hcomplementares.dto.request.CampusUpdateRequest;
import br.edu.ifrs.poa.hcomplementares.dto.response.CampusResponse;
import br.edu.ifrs.poa.hcomplementares.entity.Campus;
import br.edu.ifrs.poa.hcomplementares.entity.Usuario;
import br.edu.ifrs.poa.hcomplementares.enums.UserProfile;
import br.edu.ifrs.poa.hcomplementares.exception.BusinessRuleException;
import br.edu.ifrs.poa.hcomplementares.exception.ResourceNotFoundException;
import br.edu.ifrs.poa.hcomplementares.repository.CampusRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class CampusService {

    private final CampusRepository campusRepository;
    private final AuthenticatedUserService authenticatedUserService;

    @Transactional
    public CampusResponse criar(CampusCreateRequest request) {
        if (campusRepository.existsBySigla(request.sigla())) {
            throw new BusinessRuleException("Sigla ja existe: " + request.sigla(), "SIGLA_ALREADY_EXISTS");
        }
        Campus campus = Campus.builder()
                .nome(request.nome())
                .sigla(request.sigla())
                .cidade(request.cidade())
                .uf(request.uf())
                .ativo(true)
                .build();
        Campus saved = campusRepository.save(campus);
        return toResponse(saved);
    }

    @Transactional
    public CampusResponse atualizar(Long id, CampusUpdateRequest request) {
        Campus campus = campusRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Campus", id));
        verificarPermissaoCampus(id);
        if (request.nome() != null) campus.setNome(request.nome());
        if (request.sigla() != null) campus.setSigla(request.sigla());
        if (request.cidade() != null) campus.setCidade(request.cidade());
        if (request.uf() != null) campus.setUf(request.uf());
        Campus saved = campusRepository.save(campus);
        return toResponse(saved);
    }

    @Transactional
    public void desativar(Long id) {
        Campus campus = campusRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Campus", id));
        campus.setAtivo(false);
        campusRepository.save(campus);
    }

    public List<CampusResponse> listarTodos() {
        Usuario usuario = authenticatedUserService.getUsuarioAtual();
        if (usuario.getPerfil() == UserProfile.ADMIN_CAMPUS) {
            if (usuario.getCampus() == null) {
                return List.of();
            }
            return campusRepository.findById(usuario.getCampus().getId())
                    .filter(Campus::getAtivo)
                    .map(this::toResponse)
                    .map(List::of)
                    .orElse(List.of());
        }
        return campusRepository.findAll().stream()
                .filter(Campus::getAtivo)
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    private void verificarPermissaoCampus(Long campusId) {
        Usuario usuario = authenticatedUserService.getUsuarioAtual();
        if (usuario.getPerfil() == UserProfile.ADMIN_CAMPUS) {
            Long campusDoUsuario = usuario.getCampus() != null
                    ? usuario.getCampus().getId()
                    : null;
            if (!campusId.equals(campusDoUsuario)) {
                throw new AccessDeniedException(
                        "Administrador de campus so pode gerenciar o proprio campus");
            }
        }
    }

    public CampusResponse buscarPorId(Long id) {
        Campus campus = campusRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Campus", id));
        return toResponse(campus);
    }

    private CampusResponse toResponse(Campus c) {
        return new CampusResponse(c.getId(), c.getNome(), c.getSigla(), c.getCidade(), c.getUf(), c.getAtivo(), c.getCriadoEm());
    }
}
