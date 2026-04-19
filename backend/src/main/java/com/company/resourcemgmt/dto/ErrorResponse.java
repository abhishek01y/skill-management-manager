package com.company.resourcemgmt.dto;

import java.time.LocalDateTime;
import java.util.List;

public class ErrorResponse {

    private int status;
    private String error;
    private String message;
    private String path;
    private LocalDateTime timestamp;
    private List<FieldError> fieldErrors;

    // ===== Constructors =====

    public ErrorResponse() {
        this.timestamp = LocalDateTime.now();
    }

    public ErrorResponse(int status, String error, String message, String path,
                         LocalDateTime timestamp, List<FieldError> fieldErrors) {
        this.status = status;
        this.error = error;
        this.message = message;
        this.path = path;
        this.timestamp = (timestamp != null) ? timestamp : LocalDateTime.now();
        this.fieldErrors = fieldErrors;
    }

    // ===== Getters & Setters =====

    public int getStatus() { return status; }
    public void setStatus(int status) { this.status = status; }

    public String getError() { return error; }
    public void setError(String error) { this.error = error; }

    public String getMessage() { return message; }
    public void setMessage(String message) { this.message = message; }

    public String getPath() { return path; }
    public void setPath(String path) { this.path = path; }

    public LocalDateTime getTimestamp() { return timestamp; }
    public void setTimestamp(LocalDateTime timestamp) { this.timestamp = timestamp; }

    public List<FieldError> getFieldErrors() { return fieldErrors; }
    public void setFieldErrors(List<FieldError> fieldErrors) { this.fieldErrors = fieldErrors; }

    // ===== Inner Class =====

    public static class FieldError {

        private String field;
        private String error;

        public FieldError() {}

        public FieldError(String field, String error) {
            this.field = field;
            this.error = error;
        }

        public String getField() { return field; }
        public void setField(String field) { this.field = field; }

        public String getError() { return error; }
        public void setError(String error) { this.error = error; }
    }
}