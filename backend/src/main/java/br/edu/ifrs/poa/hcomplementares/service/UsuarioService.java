package br.edu.ifrs.poa.hcomplementares.service;

import br.edu.ifrs.poa.hcomplementares.dto.request.UsuarioCreateRequest;
import br.edu.ifrs.poa.hcomplementares.dto.request.UsuarioUpdateRequest;
import br.edu.ifrs.poa.hcomplementares.dto.response.UsuarioResponse;
import br.edu.ifrs.poa.hcomplementares.entity.Aluno;
import br.edu.ifrs.poa.hcomplementares.entity.Campus;
import br.edu.ifrs.poa.hcomplementares.entity.Curso;
import br.edu.ifrs.poa.hcomplementares.entity.Usuario;
import br.edu.ifrs.poa.hcomplementares.enums.UserProfile;
import br.edu.ifrs.poa.hcomplementares.exception.BusinessRuleException;
import br.edu.ifrs.poa.hcomplementares.exception.ResourceNotFoundException;
import br.edu.ifrs.poa.hcomplementares.repository.AlunoRepository;
import br.edu.ifrs.poa.hcomplementares.repository.CampusRepository;
import br.edu.ifrs.poa.hcomplementares.repository.CursoRepository;
import br.edu.ifrs.poa.hcomplementares.repository.UsuarioRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class UsuarioService {

    private final UsuarioRepository usuarioRepository;
    private final AlunoRepository alunoRepository;
    private final CursoRepository cursoRepository;
    private final CampusRepository campusRepository;

    @Transactional
    public UsuarioResponse registrar(UsuarioCreateRequest request) {
        if (usuarioRepository.existsByEmail(request.email())) {
            throw new BusinessRuleException("Email ja cadastrado: " + request.email(), "EMAIL_ALREADY_EXISTS");
        }
        if (usuarioRepository.existsByLoginLdap(request.loginLdap())) {
            throw new BusinessRuleException("Login LDAP ja cadastrado: " + request.loginLdap(), "LDAP_ALREADY_EXISTS");
        }

        Campus campus = null;
        if (request.perfil() == UserProfile.ADMIN_CAMPUS && request.campusId() != null) {
            campus = campusRepository.findById(request.campusId())
                    .orElseThrow(() -> new ResourceNotFoundException("Campus", request.campusId()));
        }

        Usuario usuario = Usuario.builder()
                .nome(request.nome())
                .email(request.email())
                .loginLdap(request.loginLdap())
                .perfil(request.perfil())
                .campus(campus)
                .ativo(true)
                .build();
        Usuario saved = usuarioRepository.save(usuario);
        return toResponse(saved);
    }

    public UsuarioResponse buscarPorId(Long id) {
        Usuario usuario = usuarioRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Usuario", id));
        return toResponseWithCurso(usuario);
    }

    public UsuarioResponse buscarPorEmail(String email) {
        Usuario usuario = usuarioRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("Usuario", email));
        return toResponseWithCurso(usuario);
    }

    public List<UsuarioResponse> listarTodos() {

        Authentication authentication =
                SecurityContextHolder
                        .getContext()
                        .getAuthentication();

        if (authentication == null
                || !authentication.isAuthenticated()
                || "anonymousUser".equals(authentication.getPrincipal())) {

            throw new BusinessRuleException(
                    "Usuário não autenticado.",
                    "UNAUTHENTICATED"
            );
        }

        Usuario usuarioAtual =
                usuarioRepository
                        .findByLoginLdapAndAtivoTrue(authentication.getName())
                        .orElseThrow(() ->
                                new ResourceNotFoundException(
                                        "Usuario",
                                        authentication.getName()
                                )
                        );

        return switch (usuarioAtual.getPerfil()) {

            case ADMINISTRADOR ->
                    usuarioRepository.findAll()
                            .stream()
                            .map(this::toResponseWithCurso)
                            .collect(Collectors.toList());

            case ADMIN_CAMPUS -> {

                if (usuarioAtual.getCampus() == null) {
                    throw new BusinessRuleException(
                            "Administrador de campus não possui campus associado.",
                            "CAMPUS_NAO_INFORMADO"
                    );
                }

                yield usuarioRepository
                        .findByCampusId(usuarioAtual.getCampus().getId())
                        .stream()
                        .map(this::toResponseWithCurso)
                        .collect(Collectors.toList());
            }

            default -> throw new BusinessRuleException(
                    "Usuário não possui permissão para listar usuários.",
                    "PERFIL_INVALIDO"
            );
        };
    }

    public List<UsuarioResponse> listarCampusAdmins() {
        return usuarioRepository.findByPerfil(UserProfile.ADMIN_CAMPUS).stream()
                .filter(Usuario::getAtivo)
                .map(this::toResponseWithCurso)
                .collect(Collectors.toList());
    }

    @Transactional
    public UsuarioResponse atualizar(Long id, UsuarioUpdateRequest request) {
        Usuario usuario = usuarioRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Usuario", id));

        if (!usuario.getEmail().equals(request.email()) && usuarioRepository.existsByEmail(request.email())) {
            throw new BusinessRuleException("Email ja cadastrado: " + request.email(), "EMAIL_ALREADY_EXISTS");
        }
        if (!usuario.getLoginLdap().equals(request.loginLdap()) && usuarioRepository.existsByLoginLdap(request.loginLdap())) {
            throw new BusinessRuleException("Login LDAP ja cadastrado: " + request.loginLdap(), "LDAP_ALREADY_EXISTS");
        }

        usuario.setNome(request.nome());
        usuario.setEmail(request.email());
        usuario.setLoginLdap(request.loginLdap());
        if (request.perfil() != null) {
            usuario.setPerfil(request.perfil());
        }
        if (request.ativo() != null) {
            usuario.setAtivo(request.ativo());
        }
        if (request.campusId() != null) {
            Campus campus = campusRepository.findById(request.campusId())
                    .orElseThrow(() -> new ResourceNotFoundException("Campus", request.campusId()));
            usuario.setCampus(campus);
        } else if (request.perfil() == UserProfile.ADMIN_CAMPUS) {
            throw new BusinessRuleException("Campus é obrigatório para ADMIN_CAMPUS", "CAMPUS_REQUIRED");
        }

        Usuario saved = usuarioRepository.save(usuario);
        return toResponseWithCurso(saved);
    }

    @Transactional
    public void desativarCampusAdmin(Long id) {
        Usuario usuario = usuarioRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Usuario", id));
        if (usuario.getPerfil() != UserProfile.ADMIN_CAMPUS) {
            throw new BusinessRuleException("Apenas coordenadores de campus podem ser removidos assim.", "NAO_E_ADMIN_CAMPUS");
        }
        usuario.setAtivo(false);
        usuarioRepository.save(usuario);
    }

    public boolean isAdminPrincipal(Long userId) {
        Usuario usuario = usuarioRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("Usuario", userId));
        return usuario.getPerfil() == UserProfile.ADMINISTRADOR && usuario.getCampus() == null;
    }

    public boolean isCampusAdmin(Long userId, Long campusId) {
        Usuario usuario = usuarioRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("Usuario", userId));
        return usuario.getPerfil() == UserProfile.ADMIN_CAMPUS 
                && usuario.getCampus() != null 
                && usuario.getCampus().getId().equals(campusId);
    }

    private UsuarioResponse toResponse(Usuario u) {
        return new UsuarioResponse(u.getId(), u.getNome(), u.getEmail(), u.getLoginLdap(),
                u.getPerfil(), u.getAtivo(), u.getCriadoEm(),
                u.getCampus() != null ? u.getCampus().getId() : null,
                u.getCampus() != null ? u.getCampus().getNome() : null,
                null, null);
    }

    private UsuarioResponse toResponseWithCurso(Usuario u) {
        Long cursoId = null;
        String cursoNome = null;
        if (u.getPerfil() == UserProfile.COORDENADOR || u.getPerfil() == UserProfile.ALUNO) {
            Optional<Aluno> optAluno = alunoRepository.findByUsuarioId(u.getId());
            if (optAluno.isPresent()) {
                cursoId = optAluno.get().getCurso().getId();
                cursoNome = optAluno.get().getCurso().getNome();
            } else if (u.getPerfil() == UserProfile.COORDENADOR) {
                Optional<Curso> optCurso = cursoRepository.findByCoordenadorId(u.getId());
                if (optCurso.isPresent()) {
                    cursoId = optCurso.get().getId();
                    cursoNome = optCurso.get().getNome();
                }
            }
        }
        return new UsuarioResponse(u.getId(), u.getNome(), u.getEmail(), u.getLoginLdap(),
                u.getPerfil(), u.getAtivo(), u.getCriadoEm(),
                u.getCampus() != null ? u.getCampus().getId() : null,
                u.getCampus() != null ? u.getCampus().getNome() : null,
                cursoId, cursoNome);
    }

    public UsuarioResponse buscarPorLoginLdap(String loginLdap) {

        Usuario usuario = usuarioRepository
                .findByLoginLdapAndAtivoTrue(loginLdap)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Usuario",
                                loginLdap
                        )
                );

        return toResponseWithCurso(usuario);
    }
}
