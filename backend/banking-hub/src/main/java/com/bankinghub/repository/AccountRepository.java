package com.bankinghub.repository;
import com.bankinghub.entity.Account;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface AccountRepository extends JpaRepository<Account, Long> {
    Optional<Account> findByAccountNumber(String accountNumber);
    boolean existsByAccountNumber(String accountNumber);
    List<Account> findByCustomerId(Long customerId);
    Optional<Account> findByAccountNumberAndCustomerId(String accountNumber, Long customerId);
    List<Account> findByAccountType(Account.AccountType accountType);

    @Modifying
    @Query(value = "DELETE FROM account WHERE id = :id", nativeQuery = true)
    int deleteAccountPreservingTransactions(@Param("id") Long id);
}
