package br.edu.ifrs.poa.hcomplementares.exception;

import br.edu.ifrs.poa.hcomplementares.dto.response.ApiError;
import br.edu.ifrs.poa.hcomplementares.exception.ApplicationException;
import jakarta.servlet.http.HttpServletRequest;
import lombok.extern.slf4j.Slf4j;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.ResponseEntity;
import org.springframework.http.converter.HttpMessageNotReadableException;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.context.request.ServletRequestAttributes;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.WebRequest;
import org.springframework.web.servlet.mvc.method.annotation.ResponseEntityExceptionHandler;

import java.time.Instant;
import java.util.List;
import java.util.UUID;

@Slf4j
@RestControllerAdvice
public class GlobalExceptionHandler extends ResponseEntityExceptionHandler {

    private HttpServletRequest getCurrentRequest(WebRequest request) {
        return ((ServletRequestAttributes)
                RequestContextHolder.currentRequestAttributes())
                .getRequest();
    }

    @ExceptionHandler(ApplicationException.class)
    public ResponseEntity<ApiError> handleApplicationException(
            ApplicationException ex,
            HttpServletRequest request) {

        log.warn(
                "Exception [traceId={}]: {} - {}",
                generateTraceId(),
                ex.getErrorCode(),
                ex.getMessage()
        );

        ApiError error = buildApiError(
                ex.getErrorCode(),
                ex.getMessage(),
                ex.getHttpStatus().value(),
                request
        );

        return ResponseEntity
                .status(ex.getHttpStatus())
                .body(error);
    }

    @ExceptionHandler(AccessDeniedException.class)
    public ResponseEntity<ApiError> handleAccessDenied(
            AccessDeniedException ex,
            HttpServletRequest request) {

        log.warn(
                "Access denied: {} - {}",
                request.getRequestURI(),
                ex.getMessage()
        );

        ApiError error = buildApiError(
                "ACCESS_DENIED",
                "Você não tem permissão para acessar este recurso.",
                403,
                request
        );

        return ResponseEntity
                .status(403)
                .body(error);
    }

    @Override
    protected ResponseEntity<Object> handleMethodArgumentNotValid(
            MethodArgumentNotValidException ex,
            org.springframework.http.HttpHeaders headers,
            org.springframework.http.HttpStatusCode statusCode,
            WebRequest request) {

        List<ApiError.FieldError> fieldErrors = ex.getBindingResult()
                .getFieldErrors()
                .stream()
                .map(e -> new ApiError.FieldError(
                        e.getField(),
                        e.getRejectedValue(),
                        e.getDefaultMessage()
                ))
                .toList();

        log.warn(
                "Validation failed: {} field errors",
                fieldErrors.size()
        );

        HttpServletRequest currentRequest = getCurrentRequest(request);

        ApiError error = new ApiError(
                "VALIDATION_FAILED",
                "Falha na validacao. Verifique os campos sinalizados.",
                400,
                Instant.now(),
                currentRequest.getRequestURI(),
                fieldErrors
        );

        return ResponseEntity
                .badRequest()
                .body(error);
    }

    @Override
    protected ResponseEntity<Object> handleHttpMessageNotReadable(
            HttpMessageNotReadableException ex,
            org.springframework.http.HttpHeaders headers,
            org.springframework.http.HttpStatusCode statusCode,
            WebRequest request) {

        log.warn(
                "Malformed JSON: {}",
                ex.getMessage()
        );

        HttpServletRequest currentRequest = getCurrentRequest(request);

        ApiError error = new ApiError(
                "MALFORMED_JSON",
                "Corpo da requisicao mal formado. Verifique o JSON.",
                400,
                Instant.now(),
                currentRequest.getRequestURI(),
                null
        );

        return ResponseEntity
                .badRequest()
                .body(error);
    }

    @ExceptionHandler(DataIntegrityViolationException.class)
    public ResponseEntity<ApiError> handleDataIntegrityViolation(
            DataIntegrityViolationException ex,
            HttpServletRequest request) {

        log.warn(
                "Data integrity violation [traceId={}]: {} - {}",
                generateTraceId(),
                request.getRequestURI(),
                ex.getMostSpecificCause().getMessage()
        );

        ApiError error = buildApiError(
                "DATA_INTEGRITY_VIOLATION",
                "Nao foi possivel concluir a operacao: os dados informados conflitam com registros existentes.",
                409,
                request
        );

        return ResponseEntity
                .status(409)
                .body(error);
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<ApiError> handleGenericException(
            Exception ex,
            HttpServletRequest request) {

        log.error(
                "Unexpected error [traceId={}]: {}",
                generateTraceId(),
                ex.getMessage(),
                ex
        );

        ApiError error = buildApiError(
                "INTERNAL_ERROR",
                "Um erro inesperado ocorreu. Tente novamente mais tarde.",
                500,
                request
        );

        return ResponseEntity
                .status(500)
                .body(error);
    }

    private ApiError buildApiError(
            String errorCode,
            String message,
            int status,
            HttpServletRequest request) {

        return new ApiError(
                errorCode,
                message,
                status,
                Instant.now(),
                request.getRequestURI(),
                null
        );
    }

    private String generateTraceId() {
        return UUID.randomUUID()
                .toString()
                .substring(0, 8);
    }
}
