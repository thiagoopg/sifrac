package br.edu.ifrs.poa.hcomplementares.controller;

import br.edu.ifrs.poa.hcomplementares.dto.response.GrauCursoResponse;
import br.edu.ifrs.poa.hcomplementares.service.GrauCursoService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@Tag(
        name = "Graus de Curso",
        description = "Listagem dos graus de curso disponíveis para cadastro"
)
@RestController
@RequestMapping("/api/v1/graus")
@RequiredArgsConstructor
public class GrauCursoController {

    private final GrauCursoService grauCursoService;

    @Operation(
            summary = "Listar graus de curso ativos",
            description = "Retorna os graus de curso ativos, ordenados por nome"
    )
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Graus recuperados com sucesso"),
            @ApiResponse(responseCode = "403", description = "Usuário não autenticado")
    })
    @PreAuthorize("isAuthenticated()")
    @GetMapping
    public ResponseEntity<List<GrauCursoResponse>> listar() {
        return ResponseEntity.ok(grauCursoService.listarAtivos());
    }
}
