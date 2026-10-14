package com.bankinghub.dto;

import lombok.*;

import java.time.LocalDateTime;



@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ErrorResponse {
    private boolean success;
    private String message;
    private String error;
    private LocalDateTime timestamp;

    public ErrorResponse(String message, String error) {
        this.success = false;
        this.message = message;
        this.error = error;
        this.timestamp = LocalDateTime.now();
    }
}