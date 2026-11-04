package br.edu.ifrs.poa.hcomplementares.controller;

import br.edu.ifrs.poa.hcomplementares.dto.request.TipoHoraCreateRequest;
import br.edu.ifrs.poa.hcomplementares.dto.request.TipoHoraUpdateRequest;
import br.edu.ifrs.poa.hcomplementares.dto.response.TipoHoraResponse;
import br.edu.ifrs.poa.hcomplementares.service.TipoHoraComplementarService;
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

@Tag(name = "Tipos de Hora", description = "Gestão dos tipos de horas complementares")
@RestController
@RequestMapping("/api/v1/tipos-hora")
@RequiredArgsConstructor
public class TipoHoraController {

    private final TipoHoraComplementarService tipoHoraService;

    @Operation(
            summary = "Criar tipo de hora",
            description = "Registra um novo tipo de hora complementar para um curso"
    )
    @ApiResponses({
            @ApiResponse(responseCode = "201", description = "Tipo criado com sucesso"),
            @ApiResponse(responseCode = "400", description = "Dados inválidos"),
            @ApiResponse(responseCode = "403", description = "Usuário sem permissão")
    })
    @PreAuthorize("hasAnyRole('ADMINISTRADOR', 'ADMIN_CAMPUS')")
    @PostMapping
    public ResponseEntity<TipoHoraResponse> criar(
            @Valid @RequestBody TipoHoraCreateRequest request) {

        TipoHoraResponse created = tipoHoraService.criar(request);

        URI location = ServletUriComponentsBuilder.fromCurrentRequest()
                .path("/{id}")
                .buildAndExpand(created.id())
                .toUri();

        return ResponseEntity.created(location).body(created);
    }

    @Operation(
            summary = "Atualizar tipo de hora",
            description = "Atualiza os dados de um tipo de hora existente"
    )
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Tipo atualizado com sucesso"),
            @ApiResponse(responseCode = "404", description = "Tipo não encontrado"),
            @ApiResponse(responseCode = "403", description = "Usuário sem permissão")
    })
    @PreAuthorize("hasAnyRole('ADMINISTRADOR', 'ADMIN_CAMPUS')")
    @PutMapping("/{id}")
    public ResponseEntity<TipoHoraResponse> atualizar(
            @PathVariable Long id,
            @Valid @RequestBody TipoHoraUpdateRequest request) {

        return ResponseEntity.ok(
                tipoHoraService.atualizar(id, request)
        );
    }

    @Operation(
            summary = "Desativar tipo de hora",
            description = "Marca um tipo de hora como desativado"
    )
    @ApiResponses({
            @ApiResponse(responseCode = "204", description = "Tipo desativado com sucesso"),
            @ApiResponse(responseCode = "404", description = "Tipo não encontrado"),
            @ApiResponse(responseCode = "403", description = "Usuário sem permissão")
    })
    @PreAuthorize("hasAnyRole('ADMINISTRADOR', 'ADMIN_CAMPUS')")
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> desativar(@PathVariable Long id) {

        tipoHoraService.desativar(id);

        return ResponseEntity.noContent().build();
    }

    @Operation(
            summary = "Listar tipos por curso",
            description = "Retorna os tipos de horas complementares de um curso"
    )
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Lista de tipos recuperada com sucesso"),
            @ApiResponse(responseCode = "403", description = "Usuário não autenticado")
    })
    @PreAuthorize("isAuthenticated()")
    @GetMapping
    public ResponseEntity<List<TipoHoraResponse>> listar(
            @RequestParam(required = false) Long cursoId,
            @RequestParam(required = false) Long campusId) {

        if (cursoId != null && cursoId > 0) {
            return ResponseEntity.ok(
                    tipoHoraService.listarPorCurso(cursoId)
            );
        }

        if (campusId != null && campusId > 0) {
            return ResponseEntity.ok(
                    tipoHoraService.listarPorCampus(campusId)
            );
        }

        return ResponseEntity.ok(
                tipoHoraService.listarTodos()
        );
    }

    @Operation(
            summary = "Buscar tipo por ID",
            description = "Recupera os dados de um tipo de hora pelo identificador"
    )
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Tipo encontrado"),
            @ApiResponse(responseCode = "404", description = "Tipo não encontrado"),
            @ApiResponse(responseCode = "403", description = "Usuário não autenticado")
    })
    @PreAuthorize("isAuthenticated()")
    @GetMapping("/{id}")
    public ResponseEntity<TipoHoraResponse> buscarPorId(
            @PathVariable Long id) {

        return ResponseEntity.ok(
                tipoHoraService.buscarPorId(id)
        );
    }
}