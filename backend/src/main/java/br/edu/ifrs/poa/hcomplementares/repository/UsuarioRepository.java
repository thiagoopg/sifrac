package br.edu.ifrs.poa.hcomplementares.repository;

import br.edu.ifrs.poa.hcomplementares.entity.Usuario;
import br.edu.ifrs.poa.hcomplementares.enums.UserProfile;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UsuarioRepository extends JpaRepository<Usuario, Long> {

    Optional<Usuario> findByLoginLdap(String loginLdap);

    Optional<Usuario> findByLoginLdapAndAtivoTrue(String loginLdap);

    Optional<Usuario> findByEmail(String email);

    boolean existsByLoginLdap(String loginLdap);

    boolean existsByEmail(String email);

    Optional<Usuario> findByPerfilAndAtivoTrue(UserProfile perfil);

    List<Usuario> findByCampusId(Long campusId);

    List<Usuario> findByPerfilAndCampusId(UserProfile perfil, Long campusId);

    List<Usuario> findByPerfil(UserProfile perfil);
}