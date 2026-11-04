package br.edu.ifrs.poa.hcomplementares.controller;

import br.edu.ifrs.poa.hcomplementares.dto.request.UsuarioCreateRequest;
import br.edu.ifrs.poa.hcomplementares.dto.request.UsuarioUpdateRequest;
import br.edu.ifrs.poa.hcomplementares.dto.response.UsuarioResponse;
import br.edu.ifrs.poa.hcomplementares.service.UsuarioService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import java.net.URI;
import java.util.List;

@Tag(name = "Usuários", description = "Gestão de usuários do sistema")
@RestController
@RequestMapping("/api/v1/usuarios")
@RequiredArgsConstructor
public class UsuarioController {

    private final UsuarioService usuarioService;

    @Operation(
            summary = "Registrar usuário",
            description = "Registra um novo usuário no sistema"
    )
    @ApiResponses({
            @ApiResponse(responseCode = "201", description = "Usuário registrado com sucesso"),
            @ApiResponse(responseCode = "400", description = "Dados inválidos"),
            @ApiResponse(responseCode = "409", description = "Login já cadastrado"),
            @ApiResponse(responseCode = "403", description = "Usuário sem permissão")
    })
    @PreAuthorize("hasAnyRole('ADMINISTRADOR', 'ADMIN_CAMPUS')")
    @PostMapping
    public ResponseEntity<UsuarioResponse> registrar(
            @Valid @RequestBody UsuarioCreateRequest request) {

        UsuarioResponse created = usuarioService.registrar(request);

        URI location = ServletUriComponentsBuilder
                .fromCurrentRequest()
                .path("/{id}")
                .buildAndExpand(created.id())
                .toUri();

        return ResponseEntity.created(location).body(created);
    }

    @Operation(
            summary = "Buscar usuário por ID",
            description = "Recupera os dados de um usuário pelo identificador"
    )
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Usuário encontrado"),
            @ApiResponse(responseCode = "404", description = "Usuário não encontrado"),
            @ApiResponse(responseCode = "403", description = "Usuário sem permissão")
    })
    @PreAuthorize("hasAnyRole('ADMINISTRADOR', 'ADMIN_CAMPUS')")
    @GetMapping("/{id}")
    public ResponseEntity<UsuarioResponse> buscarPorId(
            @PathVariable Long id) {

        return ResponseEntity.ok(
                usuarioService.buscarPorId(id)
        );
    }

    @Operation(
            summary = "Listar todos os usuários",
            description = "Retorna a lista de todos os usuários ou filtra por campus do admin"
    )
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Lista de usuários recuperada com sucesso"),
            @ApiResponse(responseCode = "403", description = "Usuário sem permissão")
    })
    @PreAuthorize("hasAnyRole('ADMINISTRADOR', 'ADMIN_CAMPUS')")
    @GetMapping
    public ResponseEntity<List<UsuarioResponse>> listarTodos() {

        return ResponseEntity.ok(
                usuarioService.listarTodos()
        );
    }

    @Operation(
            summary = "Listar coordenadores de campus",
            description = "Retorna apenas usuários com perfil ADMIN_CAMPUS"
    )
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Lista de coordenadores de campus recuperada com sucesso"),
            @ApiResponse(responseCode = "403", description = "Usuário sem permissão")
    })
    @PreAuthorize("hasRole('ADMINISTRADOR')")
    @GetMapping("/campus-admins")
    public ResponseEntity<List<UsuarioResponse>> listarCampusAdmins() {

        return ResponseEntity.ok(
                usuarioService.listarCampusAdmins()
        );
    }

    @Operation(
            summary = "Desativar coordenador de campus",
            description = "Remove um coordenador de campus (desativa sua conta)"
    )
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Coordenador removido com sucesso"),
            @ApiResponse(responseCode = "404", description = "Coordenador não encontrado"),
            @ApiResponse(responseCode = "400", description = "Usuário não é coordenador de campus"),
            @ApiResponse(responseCode = "403", description = "Usuário sem permissão")
    })
    @PreAuthorize("hasRole('ADMINISTRADOR')")
    @DeleteMapping("/{id}/campus-admin")
    public ResponseEntity<Void> desativarCampusAdmin(
            @PathVariable Long id) {

        usuarioService.desativarCampusAdmin(id);

        return ResponseEntity.ok().build();
    }

    @Operation(
            summary = "Atualizar usuário",
            description = "Atualiza os dados de um usuário existente"
    )
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Usuário atualizado com sucesso"),
            @ApiResponse(responseCode = "404", description = "Usuário não encontrado"),
            @ApiResponse(responseCode = "409", description = "Email ou login já cadastrado"),
            @ApiResponse(responseCode = "403", description = "Usuário sem permissão")
    })
    @PreAuthorize("hasAnyRole('ADMINISTRADOR', 'ADMIN_CAMPUS')")
    @PutMapping("/{id}")
    public ResponseEntity<UsuarioResponse> atualizar(
            @PathVariable Long id,
            @Valid @RequestBody UsuarioUpdateRequest request) {

        return ResponseEntity.ok(
                usuarioService.atualizar(id, request)
        );
    }
    @GetMapping("/me")
    @PreAuthorize("isAuthenticated()")
    public UsuarioResponse buscarUsuarioAutenticado(Authentication authentication) {

        String loginLdap = authentication.getName();

        return usuarioService.buscarPorLoginLdap(loginLdap);
    }
}