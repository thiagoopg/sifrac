package br.edu.ifrs.poa.hcomplementares.controller;

import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.nio.file.Path;
import java.nio.file.Paths;

@RestController
@RequestMapping("/uploads")
public class UploadController {

    private static final Path UPLOAD_DIR = Paths.get("uploads");

    @PreAuthorize("isAuthenticated()")
    @GetMapping("/solicitacoes/{solicitacaoId}/{filename}")
    public ResponseEntity<Resource> getFile(
            @PathVariable Long solicitacaoId,
            @PathVariable String filename) throws IOException {

        Path dir = UPLOAD_DIR
                .resolve("solicitacoes")
                .resolve(String.valueOf(solicitacaoId));

        Path file = dir.resolve(filename);

        if (!file.toAbsolutePath().startsWith(dir.toAbsolutePath())) {
            return ResponseEntity.badRequest().build();
        }

        Resource resource = new UrlResource(file.toUri());

        if (!resource.exists() || !resource.isReadable()) {
            return ResponseEntity.notFound().build();
        }

        String contentType = getContentType(file.getFileName().toString());

        String displayName = java.net.URLEncoder
                .encode(resource.getFilename(), "UTF-8")
                .replace("+", "%20");

        return ResponseEntity.ok()
                .contentType(MediaType.parseMediaType(contentType))
                .header(
                        HttpHeaders.CONTENT_DISPOSITION,
                        "inline; filename=\"" + displayName
                                + "\"; filename*=UTF-8''" + displayName
                )
                .header(
                        HttpHeaders.ACCESS_CONTROL_EXPOSE_HEADERS,
                        HttpHeaders.CONTENT_DISPOSITION
                )
                .body(resource);
    }

    private String getContentType(String filename) {
        String ext = filename.toLowerCase();

        if (ext.endsWith(".pdf")) return "application/pdf";
        if (ext.endsWith(".png")) return "image/png";
        if (ext.endsWith(".jpg") || ext.endsWith(".jpeg")) return "image/jpeg";
        if (ext.endsWith(".doc")) return "application/msword";
        if (ext.endsWith(".docx")) {
            return "application/vnd.openxmlformats-officedocument.wordprocessingml.document";
        }
        if (ext.endsWith(".txt")) return "text/plain";

        return "application/octet-stream";
    }
}