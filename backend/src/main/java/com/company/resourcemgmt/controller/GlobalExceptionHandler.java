package com.company.resourcemgmt.controller;

import com.company.resourcemgmt.dto.ErrorResponse;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.*;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.stream.Collectors;

@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ErrorResponse> handleValidation(MethodArgumentNotValidException ex,
                                                          HttpServletRequest req) {

        List<ErrorResponse.FieldError> fe = ex.getBindingResult().getFieldErrors().stream()
                .map(f -> new ErrorResponse.FieldError(f.getField(), f.getDefaultMessage()))
                .collect(Collectors.toList());

        ErrorResponse err = new ErrorResponse();
        err.setStatus(400);
        err.setError("Validation Failed");
        err.setMessage("One or more fields are invalid");
        err.setPath(req.getRequestURI());
        err.setFieldErrors(fe);

        return ResponseEntity.badRequest().body(err);
    }

    @ExceptionHandler(ResponseStatusException.class)
    public ResponseEntity<ErrorResponse> handleStatus(ResponseStatusException ex,
                                                     HttpServletRequest req) {

        ErrorResponse err = new ErrorResponse();
        err.setStatus(ex.getStatusCode().value());
        err.setError(ex.getStatusCode().toString());
        err.setMessage(ex.getReason() != null ? ex.getReason() : ex.getMessage());
        err.setPath(req.getRequestURI());

        return ResponseEntity.status(ex.getStatusCode()).body(err);
    }

    @ExceptionHandler(DataIntegrityViolationException.class)
    public ResponseEntity<ErrorResponse> handleDataIntegrity(DataIntegrityViolationException ex,
                                                            HttpServletRequest req) {

        String msg = "Data integrity violation";

        if (ex.getMessage() != null && ex.getMessage().contains("email")) {
            msg = "Employee with this email already exists.";
        }

        ErrorResponse err = new ErrorResponse();
        err.setStatus(409);
        err.setError("Conflict");
        err.setMessage(msg);
        err.setPath(req.getRequestURI());

        return ResponseEntity.status(HttpStatus.CONFLICT).body(err);
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<ErrorResponse> handleGeneric(Exception ex,
                                                      HttpServletRequest req) {

        ErrorResponse err = new ErrorResponse();
        err.setStatus(500);
        err.setError("Internal Server Error");
        err.setMessage("An unexpected error occurred.");
        err.setPath(req.getRequestURI());

        return ResponseEntity.status(500).body(err);
    }
}