package br.edu.ifrs.poa.hcomplementares.config;

import br.edu.ifrs.poa.hcomplementares.entity.Usuario;
import br.edu.ifrs.poa.hcomplementares.enums.UserProfile;
import br.edu.ifrs.poa.hcomplementares.repository.UsuarioRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.ldap.core.DirContextOperations;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.stereotype.Component;

import java.util.Collection;
import java.util.List;

@Component
@RequiredArgsConstructor
@Slf4j
public class LdapAuthoritiesPopulator
        implements org.springframework.security.ldap.userdetails.LdapAuthoritiesPopulator {

    private final UsuarioRepository usuarioRepository;

    @Override
    public Collection<? extends GrantedAuthority> getGrantedAuthorities(
            DirContextOperations userData,
            String username
    ) {
        // Pega DN do usuário para determinar perfil pela OU
        String userDn = userData.getNameInNamespace();
        log.debug("Usuário autenticado: {} | DN: {}", username, userDn);

        // Determina perfil pela OU do LDAP
        UserProfile perfil = determinarPerfilPorDn(userDn);
        log.info("Perfil determinado para {}: {}", username, perfil);

        // Busca usuário existente ou cria novo
        Usuario usuario = buscarOuCriarUsuario(username, userData, perfil);

        // Retorna autoridade baseada no perfil
        GrantedAuthority authority = toAuthority(usuario.getPerfil());
        return List.of(authority);
    }

    /**
     * Determina o perfil do usuário baseado na OU do DN do LDAP.
     * - OU=Discente -> ALUNO (cria automaticamente)
     * - OU=Docente/Professor -> null (precisa ser cadastrado manualmente pelo admin)
     * - Caso contrário -> ALUNO (default)
     */
    private UserProfile determinarPerfilPorDn(String dn) {
        if (dn == null) {
            return UserProfile.ALUNO;
        }

        String dnUpper = dn.toUpperCase();

        if (dnUpper.contains("OU=DISCENTE")) {
            return UserProfile.ALUNO;
        }

        // Docentes não são criados automaticamente - precisam ser
        // cadastrados manualmente pelo admin com perfil correto
        if (dnUpper.contains("OU=DOCENTE") || dnUpper.contains("OU=PROFESSOR")) {
            return null;
        }

        // Default: ALUNO
        return UserProfile.ALUNO;
    }

    /**
     * Busca usuário existente ou cria novo no banco de dados.
     * - ALUNO: cria automaticamente no primeiro login
     * - null (docente): só permite acesso se já estiver cadastrado pelo admin
     */
    private Usuario buscarOuCriarUsuario(
            String username,
            DirContextOperations userData,
            UserProfile perfil
    ) {
        // Busca usuário existente
        var usuarioOpt = usuarioRepository.findByLoginLdap(username);

        // Se perfil é null (docente), só permite se já existir no banco
        if (perfil == null) {
            return usuarioOpt.orElseThrow(() -> {
                log.warn("Docente {} não cadastrado no sistema. Acesso negado.", username);
                return new org.springframework.security.authentication.BadCredentialsException(
                        "Usuário não autorizado. Contacte o administrador.");
            });
        }

        if (usuarioOpt.isPresent()) {
            Usuario usuario = usuarioOpt.get();

            // Se usuário existe mas está inativo, reactiva
            if (!usuario.getAtivo()) {
                usuario.setAtivo(true);
                log.info("Reativando usuário: {}", username);
            }

            // Atualiza perfil se necessário (pode ter mudado no LDAP)
            if (usuario.getPerfil() != perfil) {
                usuario.setPerfil(perfil);
                log.info("Atualizando perfil de {} para {}", username, perfil);
            }

            return usuarioRepository.save(usuario);
        }

        // Cria novo usuário
        String nome = userData.getStringAttribute("cn");
        String email = userData.getStringAttribute("mail");

        // Fallback para atributos alternativos
        if (nome == null || nome.isBlank()) {
            nome = username;
        }
        if (email == null || email.isBlank()) {
            email = username + "@email.local";
        }

        Usuario novoUsuario = Usuario.builder()
                .nome(nome)
                .email(email)
                .loginLdap(username)
                .perfil(perfil)
                .ativo(true)
                .build();

        log.info("Criando novo usuário: {} | perfil: {} | email: {}", username, perfil, email);
        return usuarioRepository.save(novoUsuario);
    }

    private GrantedAuthority toAuthority(UserProfile perfil) {
        return switch (perfil) {
            case ALUNO -> new SimpleGrantedAuthority("ROLE_ALUNO");
            case COORDENADOR -> new SimpleGrantedAuthority("ROLE_COORDENADOR");
            case ADMIN_CAMPUS -> new SimpleGrantedAuthority("ROLE_ADMIN_CAMPUS");
            case ADMINISTRADOR -> new SimpleGrantedAuthority("ROLE_ADMINISTRADOR");
        };
    }
}