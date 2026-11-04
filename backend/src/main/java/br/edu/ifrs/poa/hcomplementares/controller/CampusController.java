package br.edu.ifrs.poa.hcomplementares.controller;

import br.edu.ifrs.poa.hcomplementares.dto.request.CampusCreateRequest;
import br.edu.ifrs.poa.hcomplementares.dto.request.CampusUpdateRequest;
import br.edu.ifrs.poa.hcomplementares.dto.response.CampusResponse;
import br.edu.ifrs.poa.hcomplementares.entity.Usuario;
import br.edu.ifrs.poa.hcomplementares.enums.UserProfile;
import br.edu.ifrs.poa.hcomplementares.service.AuthenticatedUserService;
import br.edu.ifrs.poa.hcomplementares.service.CampusService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import java.net.URI;
import java.util.List;

@Tag(name = "Campus", description = "Gestão de campi do IFRS")
@RestController
@RequestMapping("/api/v1/campuses")
@RequiredArgsConstructor
public class CampusController {

    private final CampusService campusService;
    private final AuthenticatedUserService authenticatedUserService;

    @Operation(summary = "Criar campus", description = "Registra um novo campus no sistema")
    @ApiResponses({
            @ApiResponse(responseCode = "201", description = "Campus criado com sucesso"),
            @ApiResponse(responseCode = "400", description = "Dados inválidos"),
            @ApiResponse(responseCode = "403", description = "Usuário sem permissão")
    })
    @PreAuthorize("hasRole('ADMINISTRADOR')")
    @PostMapping
    public ResponseEntity<CampusResponse> criar(@Valid @RequestBody CampusCreateRequest request) {
        CampusResponse created = campusService.criar(request);
        URI location = ServletUriComponentsBuilder.fromCurrentRequest()
                .path("/{id}").buildAndExpand(created.id()).toUri();
        return ResponseEntity.created(location).body(created);
    }

    @Operation(summary = "Atualizar campus", description = "Atualiza os dados de um campus existente")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Campus atualizado com sucesso"),
            @ApiResponse(responseCode = "404", description = "Campus não encontrado"),
            @ApiResponse(responseCode = "403", description = "Usuário sem permissão")
    })
    @PreAuthorize("hasAnyRole('ADMINISTRADOR', 'ADMIN_CAMPUS')")
    @PutMapping("/{id}")
    public ResponseEntity<CampusResponse> atualizar(
            @PathVariable Long id,
            @Valid @RequestBody CampusUpdateRequest request) {
        return ResponseEntity.ok(campusService.atualizar(id, request));
    }

    @Operation(summary = "Desativar campus", description = "Marca um campus como desativado")
    @ApiResponses({
            @ApiResponse(responseCode = "204", description = "Campus desativado com sucesso"),
            @ApiResponse(responseCode = "404", description = "Campus não encontrado"),
            @ApiResponse(responseCode = "403", description = "Usuário sem permissão")
    })
    @PreAuthorize("hasRole('ADMINISTRADOR')")
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> desativar(@PathVariable Long id) {
        campusService.desativar(id);
        return ResponseEntity.noContent().build();
    }

    @Operation(summary = "Listar todos os campus", description = "Retorna a lista de todos os campus ativos")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Lista de campus recuperada com sucesso"),
            @ApiResponse(responseCode = "403", description = "Usuário não autenticado")
    })
    @PreAuthorize("isAuthenticated()")
    @GetMapping
    public ResponseEntity<List<CampusResponse>> listarTodos() {
        Usuario atual = authenticatedUserService.getUsuarioAtual();
        if (atual.getPerfil() == UserProfile.ADMIN_CAMPUS && atual.getCampus() != null) {
            return ResponseEntity.ok(List.of(campusService.buscarPorId(atual.getCampus().getId())));
        }
        return ResponseEntity.ok(campusService.listarTodos());
    }

    @Operation(summary = "Buscar campus por ID", description = "Recupera os dados de um campus pelo identificador")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Campus encontrado"),
            @ApiResponse(responseCode = "404", description = "Campus não encontrado"),
            @ApiResponse(responseCode = "403", description = "Usuário não autenticado")
    })
    @PreAuthorize("isAuthenticated()")
    @GetMapping("/{id}")
    public ResponseEntity<CampusResponse> buscarPorId(@PathVariable Long id) {
        return ResponseEntity.ok(campusService.buscarPorId(id));
    }
}