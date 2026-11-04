package br.edu.ifrs.poa.hcomplementares.service;

import br.edu.ifrs.poa.hcomplementares.entity.Usuario;
import br.edu.ifrs.poa.hcomplementares.exception.ResourceNotFoundException;
import br.edu.ifrs.poa.hcomplementares.repository.UsuarioRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthenticatedUserService {

    private final UsuarioRepository usuarioRepository;

    public Usuario getUsuarioAtual() {
        Authentication authentication =
                SecurityContextHolder.getContext().getAuthentication();

        String loginLdap = authentication.getName();

        return usuarioRepository.findByLoginLdapAndAtivoTrue(loginLdap)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Usuario", loginLdap));
    }
}