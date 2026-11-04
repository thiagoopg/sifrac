package br.edu.ifrs.poa.hcomplementares.controller;

import br.edu.ifrs.poa.hcomplementares.dto.response.NotificacaoResponse;
import br.edu.ifrs.poa.hcomplementares.service.NotificacaoService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Tag(name = "Notificações", description = "Gestão de notificações do usuário")
@RestController
@RequestMapping("/api/v1/notificacoes")
@RequiredArgsConstructor
public class NotificacaoController {

    private final NotificacaoService notificacaoService;

    @Operation(
            summary = "Listar notificações do usuário",
            description = "Retorna as notificações do usuário logado, ordenadas pela mais recente"
    )
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Lista de notificações recuperada com sucesso"),
            @ApiResponse(responseCode = "403", description = "Usuário não autenticado")
    })
    @PreAuthorize("isAuthenticated()")
    @GetMapping
    public ResponseEntity<List<NotificacaoResponse>> listar(@RequestParam Long usuarioId) {
        return ResponseEntity.ok(notificacaoService.listarPorUsuario(usuarioId));
    }

    @Operation(
            summary = "Contar notificações não lidas",
            description = "Retorna a quantidade de notificações não lidas do usuário"
    )
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Contagem retornada com sucesso"),
            @ApiResponse(responseCode = "403", description = "Usuário não autenticado")
    })
    @PreAuthorize("isAuthenticated()")
    @GetMapping("/nao-lidas/count")
    public ResponseEntity<Long> contarNaoLidas(@RequestParam Long usuarioId) {
        return ResponseEntity.ok(notificacaoService.contarNaoLidas(usuarioId));
    }

    @Operation(
            summary = "Marcar notificação como lida",
            description = "Marca uma notificação específica como lida"
    )
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Notificação marcada como lida"),
            @ApiResponse(responseCode = "403", description = "Usuário não autenticado")
    })
    @PreAuthorize("isAuthenticated()")
    @PutMapping("/{id}/marcar-lida")
    public ResponseEntity<NotificacaoResponse> marcarLida(
            @PathVariable Long id,
            @RequestParam Long usuarioId) {
        return ResponseEntity.ok(notificacaoService.marcarComoLida(id, usuarioId));
    }

    @Operation(
            summary = "Marcar todas como lidas",
            description = "Marca todas as notificações do usuário como lidas"
    )
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Todas marcadas como lidas"),
            @ApiResponse(responseCode = "403", description = "Usuário não autenticado")
    })
    @PreAuthorize("isAuthenticated()")
    @PutMapping("/marcar-todas-lidas")
    public ResponseEntity<Void> marcarTodasLidas(@RequestParam Long usuarioId) {
        notificacaoService.marcarTodasComoLidas(usuarioId);
        return ResponseEntity.ok().build();
    }
}