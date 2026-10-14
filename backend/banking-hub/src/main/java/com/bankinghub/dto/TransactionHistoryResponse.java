package com.bankinghub.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
class TransactionHistoryResponse {
    private Long id;
    private String transactionType;
    private BigDecimal amount;
    private String currency;
    private String fromAccountNumber;
    private String toAccountNumber;
    private String status;
    private String description;
    private String referenceNumber;
    private LocalDateTime createdAt;
}
