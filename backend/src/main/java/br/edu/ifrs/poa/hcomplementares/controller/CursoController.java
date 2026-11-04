package br.edu.ifrs.poa.hcomplementares.controller;

import br.edu.ifrs.poa.hcomplementares.dto.request.CursoCreateRequest;
import br.edu.ifrs.poa.hcomplementares.dto.request.CursoUpdateRequest;
import br.edu.ifrs.poa.hcomplementares.dto.response.CursoResponse;
import br.edu.ifrs.poa.hcomplementares.service.CursoService;
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

@Tag(name = "Cursos", description = "Gestão de cursos do IFRS")
@RestController
@RequestMapping("/api/v1/cursos")
@RequiredArgsConstructor
public class CursoController {

    private final CursoService cursoService;

    @Operation(summary = "Criar curso", description = "Registra um novo curso no sistema")
    @ApiResponses({
            @ApiResponse(responseCode = "201", description = "Curso criado com sucesso"),
            @ApiResponse(responseCode = "400", description = "Dados inválidos"),
            @ApiResponse(responseCode = "403", description = "Usuário sem permissão")
    })
    @PreAuthorize("hasAnyRole('ADMINISTRADOR', 'ADMIN_CAMPUS')")
    @PostMapping
    public ResponseEntity<CursoResponse> criar(@Valid @RequestBody CursoCreateRequest request) {
        CursoResponse created = cursoService.criar(request);
        URI location = ServletUriComponentsBuilder.fromCurrentRequest()
                .path("/{id}").buildAndExpand(created.id()).toUri();
        return ResponseEntity.created(location).body(created);
    }

    @Operation(summary = "Atualizar curso", description = "Atualiza os dados de um curso existente")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Curso atualizado com sucesso"),
            @ApiResponse(responseCode = "404", description = "Curso não encontrado"),
            @ApiResponse(responseCode = "403", description = "Usuário sem permissão")
    })
    @PreAuthorize("hasAnyRole('ADMINISTRADOR', 'ADMIN_CAMPUS')")
    @PutMapping("/{id}")
    public ResponseEntity<CursoResponse> atualizar(
            @PathVariable Long id,
            @Valid @RequestBody CursoUpdateRequest request) {
        return ResponseEntity.ok(cursoService.atualizar(id, request));
    }

    @Operation(summary = "Desativar curso", description = "Marca um curso como desativado")
    @ApiResponses({
            @ApiResponse(responseCode = "204", description = "Curso desativado com sucesso"),
            @ApiResponse(responseCode = "404", description = "Curso não encontrado"),
            @ApiResponse(responseCode = "403", description = "Usuário sem permissão")
    })
    @PreAuthorize("hasAnyRole('ADMINISTRADOR', 'ADMIN_CAMPUS')")
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> desativar(@PathVariable Long id) {
        cursoService.desativar(id);
        return ResponseEntity.noContent().build();
    }

    @Operation(summary = "Listar cursos", description = "Retorna a lista de todos os cursos ou filtra por campus")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Lista de cursos recuperada com sucesso"),
            @ApiResponse(responseCode = "403", description = "Usuário não autenticado")
    })
    @PreAuthorize("isAuthenticated()")
    @GetMapping
    public ResponseEntity<List<CursoResponse>> listarTodos(
            @RequestParam(required = false) Long campusId,
            @RequestParam(required = false) Long userId) {

        if (campusId != null) {
            return ResponseEntity.ok(cursoService.listarPorCampus(campusId));
        }

        if (userId != null) {
            return ResponseEntity.ok(cursoService.listarTodos(userId));
        }

        // Sem userId, retorna todos os cursos ativos
        return ResponseEntity.ok(cursoService.listarTodos(1L));
    }

    @Operation(summary = "Buscar curso por ID", description = "Recupera os dados de um curso pelo identificador")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Curso encontrado"),
            @ApiResponse(responseCode = "404", description = "Curso não encontrado"),
            @ApiResponse(responseCode = "403", description = "Usuário não autenticado")
    })
    @PreAuthorize("isAuthenticated()")
    @GetMapping("/{id}")
    public ResponseEntity<CursoResponse> buscarPorId(@PathVariable Long id) {
        return ResponseEntity.ok(cursoService.buscarPorId(id));
    }
}