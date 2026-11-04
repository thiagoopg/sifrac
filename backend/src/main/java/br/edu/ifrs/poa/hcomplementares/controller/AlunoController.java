package br.edu.ifrs.poa.hcomplementares.controller;

import br.edu.ifrs.poa.hcomplementares.dto.request.AlunoCreateRequest;
import br.edu.ifrs.poa.hcomplementares.dto.response.AlunoResponse;
import br.edu.ifrs.poa.hcomplementares.service.AlunoService;
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
import java.util.Map;

@Tag(name = "Alunos", description = "Gestão de alunos e cálculo de horas complementares")
@RestController
@RequestMapping("/api/v1/alunos")
@RequiredArgsConstructor
public class AlunoController {

    private final AlunoService alunoService;

    @Operation(summary = "Cadastrar aluno", description = "Registra um novo aluno no sistema")
    @ApiResponses({
            @ApiResponse(responseCode = "201", description = "Aluno cadastrado com sucesso"),
            @ApiResponse(responseCode = "400", description = "Dados inválidos"),
            @ApiResponse(responseCode = "403", description = "Usuário sem permissão")
    })
    @PreAuthorize("hasAnyRole('ADMINISTRADOR', 'ADMIN_CAMPUS')")
    @PostMapping
    public ResponseEntity<AlunoResponse> criar(@Valid @RequestBody AlunoCreateRequest request) {
        AlunoResponse created = alunoService.criar(request);
        URI location = ServletUriComponentsBuilder.fromCurrentRequest()
                .path("/{id}").buildAndExpand(created.id()).toUri();
        return ResponseEntity.created(location).body(created);
    }

    @Operation(summary = "Listar alunos", description = "Lista todos os alunos ou filtra por curso")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Lista de alunos recuperada com sucesso"),
            @ApiResponse(responseCode = "403", description = "Usuário sem permissão")
    })
    @PreAuthorize("hasAnyRole('ADMINISTRADOR', 'ADMIN_CAMPUS', 'COORDENADOR')")
    @GetMapping
    public ResponseEntity<List<AlunoResponse>> listar(@RequestParam(required = false) Long cursoId) {
        if (cursoId != null && cursoId > 0) {
            return ResponseEntity.ok(alunoService.listarPorCurso(cursoId));
        }
        return ResponseEntity.ok(alunoService.listarTodos());
    }

    @Operation(summary = "Buscar aluno por matrícula", description = "Recupera os dados do aluno pela matrícula")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Aluno encontrado"),
            @ApiResponse(responseCode = "404", description = "Aluno não encontrado"),
            @ApiResponse(responseCode = "403", description = "Usuário sem permissão")
    })
    @PreAuthorize("hasAnyRole('ADMINISTRADOR', 'ADMIN_CAMPUS', 'COORDENADOR')")
    @GetMapping("/{matricula}")
    public ResponseEntity<AlunoResponse> buscarPorMatricula(@PathVariable String matricula) {
        return ResponseEntity.ok(alunoService.buscarPorMatricula(matricula));
    }

    @Operation(summary = "Horas diferidas por tipo", description = "Retorna a quantidade de horas diferidas agrupadas por tipo para um aluno")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Dados calculados com sucesso"),
            @ApiResponse(responseCode = "403", description = "Usuário sem permissão")
    })
    @PreAuthorize("hasAnyRole('ADMINISTRADOR', 'ADMIN_CAMPUS', 'COORDENADOR', 'ALUNO')")
    @GetMapping("/{id}/horas")
    public ResponseEntity<Map<String, Integer>> horasDeferidasPorTipo(@PathVariable Long id) {
        return ResponseEntity.ok(alunoService.calcularHorasDeferredasPorTipo(id));
    }

    @Operation(summary = "Buscar aluno por ID do usuário", description = "Retorna os dados do aluno vinculado a um usuário específico")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Aluno encontrado"),
            @ApiResponse(responseCode = "404", description = "Aluno não encontrado"),
            @ApiResponse(responseCode = "403", description = "Usuário sem permissão")
    })
    @PreAuthorize("hasAnyRole('ADMINISTRADOR', 'ADMIN_CAMPUS', 'COORDENADOR')")
    @GetMapping("/por-usuario/{usuarioId}")
    public ResponseEntity<AlunoResponse> buscarPorUsuarioId(@PathVariable Long usuarioId) {
        return ResponseEntity.ok(alunoService.buscarPorUsuarioId(usuarioId));
    }
}