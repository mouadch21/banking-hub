package com.bankinghub.repository;
import com.bankinghub.entity.Transaction;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;


@Repository
public interface TransactionRepository extends JpaRepository<Transaction, Long> {
    Optional<Transaction> findByReferenceNumber(String referenceNumber);
    List<Transaction> findByFromAccountIdOrderByCreatedAtDesc(Long fromAccountId);
    List<Transaction> findByToAccountIdOrderByCreatedAtDesc(Long toAccountId);
    List<Transaction> findByFromAccountIdOrToAccountIdOrderByCreatedAtDesc(Long fromAccountId, Long toAccountId);
    List<Transaction> findByTransactionTypeOrderByCreatedAtDesc(Transaction.TransactionType type);
    List<Transaction> findByCreatedAtBetween(LocalDateTime startDate, LocalDateTime endDate);
    List<Transaction> findByFromAccountIdAndCreatedAtBetweenOrderByCreatedAtDesc(
            Long accountId, LocalDateTime startDate, LocalDateTime endDate);
    List<Transaction> findByToAccountIdAndCreatedAtBetweenOrderByCreatedAtDesc(
            Long accountId, LocalDateTime startDate, LocalDateTime endDate);
}
