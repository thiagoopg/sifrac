package br.edu.ifrs.poa.hcomplementares.controller;

import br.edu.ifrs.poa.hcomplementares.dto.request.SolicitacaoAvaliacaoRequest;
import br.edu.ifrs.poa.hcomplementares.dto.request.SolicitacaoCreateRequest;
import br.edu.ifrs.poa.hcomplementares.dto.response.SolicitacaoResponse;
import br.edu.ifrs.poa.hcomplementares.service.SolicitacaoService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import java.net.URI;
import java.util.List;

@Tag(name = "Solicitações", description = "Gestão de solicitações de horas complementares")
@RestController
@RequestMapping("/api/v1/solicitacoes")
@RequiredArgsConstructor
public class SolicitacaoController {

    private final SolicitacaoService solicitacaoService;

    @Operation(summary = "Criar solicitação", description = "Registra uma nova solicitação de horas complementares")
    @ApiResponses({
            @ApiResponse(responseCode = "201", description = "Solicitação criada com sucesso"),
            @ApiResponse(responseCode = "400", description = "Dados inválidos ou violação de regra de negócio"),
            @ApiResponse(responseCode = "409", description = "Horas máximas excedidas"),
            @ApiResponse(responseCode = "403", description = "Usuário sem permissão")})
    @PreAuthorize("hasRole('ALUNO')")
    @PostMapping
    public ResponseEntity<SolicitacaoResponse> criar(@Valid @RequestBody SolicitacaoCreateRequest request) {

        SolicitacaoResponse created = solicitacaoService.criar(request);

        URI location = ServletUriComponentsBuilder.fromCurrentRequest().path("/{id}").buildAndExpand(created.id()).toUri();

        return ResponseEntity.created(location).body(created);
    }

    @Operation(summary = "Criar solicitação com anexo", description = "Registra uma nova solicitação com título e arquivo/certificado")
    @ApiResponses({
            @ApiResponse(responseCode = "201", description = "Solicitação criada com sucesso"),
            @ApiResponse(responseCode = "400", description = "Dados inválidos"),
            @ApiResponse(responseCode = "409", description = "Horas máximas excedidas"),
            @ApiResponse(responseCode = "403", description = "Usuário sem permissão")})
    @PreAuthorize("hasRole('ALUNO')")
    @PostMapping(value = "/upload", consumes = "multipart/form-data")
    public ResponseEntity<SolicitacaoResponse> criarComAnexo(@Parameter(description = "ID do tipo de hora") @RequestParam Long tipoHoraId,

                                                             @Parameter(description = "Título da solicitação") @RequestParam String titulo,

                                                             @Parameter(description = "Horas solicitadas") @RequestParam Integer horasSolicitadas,

                                                             @Parameter(description = "Arquivo/certificado") @RequestParam(value = "arquivo", required = false) MultipartFile arquivo) {

        SolicitacaoResponse created = solicitacaoService.criarComAnexo(tipoHoraId, titulo, horasSolicitadas, arquivo);

        URI location = ServletUriComponentsBuilder.fromCurrentRequest().path("/{id}").buildAndExpand(created.id()).toUri();

        return ResponseEntity.created(location).body(created);
    }

    @Operation(summary = "Avaliar solicitação", description = "Aprova ou rejeita uma solicitação pendente")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Solicitação avaliada com sucesso"),
            @ApiResponse(responseCode = "404", description = "Solicitação não encontrada"),
            @ApiResponse(responseCode = "400", description = "Solicitação não está pendente"),
            @ApiResponse(responseCode = "403", description = "Usuário sem permissão")})
    @PreAuthorize("hasRole('COORDENADOR')")
    @PutMapping("/{id}/avaliar")
    public ResponseEntity<SolicitacaoResponse> avaliar(
            @PathVariable Long id,
            @Valid @RequestBody SolicitacaoAvaliacaoRequest request) {

        return ResponseEntity.ok(solicitacaoService.avaliar(id, request));
    }

    @Operation(summary = "Cancelar solicitação", description = "Cancela uma solicitação pelo aluno solicitante")
    @ApiResponses({
            @ApiResponse(responseCode = "204", description = "Solicitação cancelada com sucesso"),
            @ApiResponse(responseCode = "404", description = "Solicitação não encontrada"),
            @ApiResponse(responseCode = "403", description = "Usuário sem permissão")})
    @PreAuthorize("hasRole('ALUNO')")
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> cancelar(@PathVariable Long id) {

        solicitacaoService.cancelar(id);

        return ResponseEntity.noContent().build();
    }

    @Operation(summary = "Listar solicitações", description = "Lista solicitações conforme o perfil e filtros informados")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Lista de solicitações recuperada com sucesso"),
            @ApiResponse(responseCode = "403", description = "Usuário sem permissão")})
    @PreAuthorize("hasAnyRole('ADMINISTRADOR', 'ADMIN_CAMPUS', 'COORDENADOR')")
    @GetMapping
    public ResponseEntity<List<SolicitacaoResponse>> listar(
            @RequestParam(required = false) Long campusId,
            @RequestParam(required = false) String status) {

        if (campusId != null) {
            return ResponseEntity.ok(
                    solicitacaoService.listarPorCampus(campusId)
            );
        }

        return ResponseEntity.ok(
                solicitacaoService.listarTodas()
        );
    }

    @Operation(summary = "Listar solicitações do usuário logado", description = "Retorna solicitações filtradas pelo perfil: ADMIN vê tudo, COORDENADOR vê do seu curso, ALUNO vê as suas")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Solicitações recuperadas com sucesso"),
            @ApiResponse(responseCode = "403", description = "Usuário sem permissão")})
    @PreAuthorize("isAuthenticated()")
    @GetMapping("/meu")
    public ResponseEntity<List<SolicitacaoResponse>> listarMeu(@RequestParam(required = false) String status) {

        return ResponseEntity.ok(solicitacaoService.listarPorUsuario(status));
    }

    @Operation(summary = "Buscar solicitação por ID", description = "Recupera os dados de uma solicitação pelo identificador")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Solicitação encontrada"),
            @ApiResponse(responseCode = "404", description = "Solicitação não encontrada"),
            @ApiResponse(responseCode = "403", description = "Usuário sem permissão")})
    @PreAuthorize("isAuthenticated()")
    @GetMapping("/{id}")
    public ResponseEntity<SolicitacaoResponse> buscarPorId(@PathVariable Long id) {

        return ResponseEntity.ok(solicitacaoService.buscarPorId(id));
    }

    @Operation(summary = "Listar solicitações de um aluno", description = "Retorna todas as solicitações de um aluno específico")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Lista de solicitações recuperada com sucesso"),
            @ApiResponse(responseCode = "403", description = "Usuário sem permissão")})
    @PreAuthorize("hasAnyRole('ADMINISTRADOR', 'ADMIN_CAMPUS', 'COORDENADOR')")
    @GetMapping("/aluno/{alunoId}")
    public ResponseEntity<List<SolicitacaoResponse>> listarPorAluno(@PathVariable Long alunoId) {

        return ResponseEntity.ok(solicitacaoService.listarPorAluno(alunoId));
    }
}