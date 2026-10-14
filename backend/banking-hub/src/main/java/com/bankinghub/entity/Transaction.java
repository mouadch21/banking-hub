package com.bankinghub.entity;

import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import org.hibernate.annotations.JdbcTypeCode;
import java.sql.Types;
@Entity
@Table(name = "transaction")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Transaction {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "transaction_type", nullable = false)
    @Enumerated(EnumType.STRING)
    @JdbcTypeCode(Types.VARCHAR)
    private TransactionType transactionType;

    @Column(nullable = false)
    private BigDecimal amount;

    @Column(length = 3)
    private String currency;

    @Column(name = "from_account_id")
    private Long fromAccountId;

    @Column(name = "to_account_id")
    private Long toAccountId;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "from_account_id", insertable = false, updatable = false)
    private Account fromAccount;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "to_account_id", insertable = false, updatable = false)
    private Account toAccount;

    @Column
    @Enumerated(EnumType.STRING)
    @JdbcTypeCode(Types.VARCHAR)
    private TransactionStatus status;

    @Column
    private String description;

    @Column(name = "reference_number", unique = true)
    private String referenceNumber;

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
        if (currency == null) {
            currency = "USD";
        }
        if (status == null) {
            status = TransactionStatus.SUCCESS;
        }
        if (referenceNumber == null) {
            referenceNumber = "TXN" + System.currentTimeMillis();
        }
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }

    public enum TransactionType {
        DEPOSIT, WITHDRAW, TRANSFER
    }

    public enum TransactionStatus {
        SUCCESS, FAILED, PENDING
    }
}