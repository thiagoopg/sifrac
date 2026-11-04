package br.edu.ifrs.poa.hcomplementares.config;

import br.edu.ifrs.poa.hcomplementares.entity.Usuario;
import br.edu.ifrs.poa.hcomplementares.repository.UsuarioRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.ldap.core.DirContextOperations;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.stereotype.Component;

import java.util.Collection;
import java.util.List;

@Component
@RequiredArgsConstructor
public class LdapAuthoritiesPopulator
        implements org.springframework.security.ldap.userdetails.LdapAuthoritiesPopulator {

    private final UsuarioRepository usuarioRepository;

    @Override
    public Collection<? extends GrantedAuthority> getGrantedAuthorities(
            DirContextOperations userData,
            String username
    ) {

        return usuarioRepository.findByLoginLdapAndAtivoTrue(username)
                .map(usuario -> {

                    GrantedAuthority authority = toAuthority(usuario);

                    return authority;
                })
                .map(List::of)
                .orElseGet(() -> {
                    System.out.println("NENHUM usuário encontrado no banco!");
                    return List.of();
                });
    }

    private GrantedAuthority toAuthority(Usuario usuario) {
        return switch (usuario.getPerfil()) {
            case ALUNO ->
                    new SimpleGrantedAuthority("ROLE_ALUNO");

            case COORDENADOR ->
                    new SimpleGrantedAuthority("ROLE_COORDENADOR");

            case ADMIN_CAMPUS ->
                    new SimpleGrantedAuthority("ROLE_ADMIN_CAMPUS");

            case ADMINISTRADOR ->
                    new SimpleGrantedAuthority("ROLE_ADMINISTRADOR");
        };
    }
}