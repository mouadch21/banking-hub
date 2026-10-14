package com.bankinghub.service;

import com.bankinghub.dto.*;
import com.bankinghub.entity.*;
import com.bankinghub.repository.*;
import com.bankinghub.exception.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;
import java.util.UUID;

@Service
public class TransactionService {

    @Autowired
    private TransactionRepository transactionRepository;

    @Autowired
    private AccountRepository accountRepository;

    @Autowired
    private AccountService accountService;

    @Transactional
    public TransactionResponse deposit(DepositRequest request) {
        Account account = accountRepository.findById(request.getAccountId())
                .orElseThrow(() -> new ResourceNotFoundException("Account not found with ID: " + request.getAccountId()));

        if (account.getStatus() != Account.AccountStatus.ACTIVE) {
            throw new InvalidOperationException("Account is not active. Current status: " + account.getStatus());
        }

        if (request.getAmount().compareTo(BigDecimal.ZERO) <= 0) {
            throw new InvalidOperationException("Amount must be greater than zero");
        }

        // Update balance
        BigDecimal newBalance = account.getBalance().add(request.getAmount());
        account.setBalance(newBalance);
        accountRepository.save(account);

        // Create transaction record
        Transaction transaction = Transaction.builder()
                .transactionType(Transaction.TransactionType.DEPOSIT)
                .amount(request.getAmount())
                .currency(account.getCurrency())
                .toAccountId(account.getId())
                .toAccount(account)
                .status(Transaction.TransactionStatus.SUCCESS)
                .description(request.getDescription() != null ? request.getDescription() : "Deposit to account")
                .referenceNumber("DEP" + System.currentTimeMillis())
                .build();

        Transaction savedTransaction = transactionRepository.save(transaction);
        return mapToTransactionResponse(savedTransaction);
    }

    @Transactional
    public TransactionResponse withdraw(WithdrawRequest request) {
        Account account = accountRepository.findById(request.getAccountId())
                .orElseThrow(() -> new ResourceNotFoundException("Account not found with ID: " + request.getAccountId()));

        if (account.getStatus() != Account.AccountStatus.ACTIVE) {
            throw new InvalidOperationException("Account is not active. Current status: " + account.getStatus());
        }

        if (request.getAmount().compareTo(BigDecimal.ZERO) <= 0) {
            throw new InvalidOperationException("Amount must be greater than zero");
        }

        if (account.getBalance().compareTo(request.getAmount()) < 0) {
            throw new InsufficientFundsException("Insufficient funds. Available balance: " + account.getBalance());
        }

        // Update balance
        BigDecimal newBalance = account.getBalance().subtract(request.getAmount());
        account.setBalance(newBalance);
        accountRepository.save(account);

        // Create transaction record
        Transaction transaction = Transaction.builder()
                .transactionType(Transaction.TransactionType.WITHDRAW)
                .amount(request.getAmount())
                .currency(account.getCurrency())
                .fromAccountId(account.getId())
                .fromAccount(account)
                .status(Transaction.TransactionStatus.SUCCESS)
                .description(request.getDescription() != null ? request.getDescription() : "Withdrawal from account")
                .referenceNumber("WTH" + System.currentTimeMillis())
                .build();

        Transaction savedTransaction = transactionRepository.save(transaction);
        return mapToTransactionResponse(savedTransaction);
    }

    @Transactional
    public TransactionResponse transfer(TransferRequest request) {
        Account fromAccount = accountRepository.findById(request.getFromAccountId())
                .orElseThrow(() -> new ResourceNotFoundException("From account not found with ID: " + request.getFromAccountId()));

        Account toAccount = accountRepository.findById(request.getToAccountId())
                .orElseThrow(() -> new ResourceNotFoundException("To account not found with ID: " + request.getToAccountId()));

        if (fromAccount.getStatus() != Account.AccountStatus.ACTIVE) {
            throw new InvalidOperationException("From account is not active. Current status: " + fromAccount.getStatus());
        }

        if (toAccount.getStatus() != Account.AccountStatus.ACTIVE) {
            throw new InvalidOperationException("To account is not active. Current status: " + toAccount.getStatus());
        }

        if (request.getAmount().compareTo(BigDecimal.ZERO) <= 0) {
            throw new InvalidOperationException("Amount must be greater than zero");
        }

        if (fromAccount.getBalance().compareTo(request.getAmount()) < 0) {
            throw new InsufficientFundsException("Insufficient funds. Available balance: " + fromAccount.getBalance());
        }

        if (fromAccount.getId().equals(toAccount.getId())) {
            throw new InvalidOperationException("Cannot transfer to the same account");
        }

        // Update balances
        fromAccount.setBalance(fromAccount.getBalance().subtract(request.getAmount()));
        toAccount.setBalance(toAccount.getBalance().add(request.getAmount()));

        accountRepository.save(fromAccount);
        accountRepository.save(toAccount);

        // Create transaction record
        Transaction transaction = Transaction.builder()
                .transactionType(Transaction.TransactionType.TRANSFER)
                .amount(request.getAmount())
                .currency(fromAccount.getCurrency())
                .fromAccountId(fromAccount.getId())
                .toAccountId(toAccount.getId())
                .fromAccount(fromAccount)
                .toAccount(toAccount)
                .status(Transaction.TransactionStatus.SUCCESS)
                .description(request.getDescription() != null ? request.getDescription() :
                        "Transfer from " + fromAccount.getAccountNumber() + " to " + toAccount.getAccountNumber())
                .referenceNumber("TRF" + System.currentTimeMillis())
                .build();

        Transaction savedTransaction = transactionRepository.save(transaction);
        return mapToTransactionResponse(savedTransaction);
    }

    public TransactionResponse getTransaction(Long transactionId) {
        Transaction transaction = transactionRepository.findById(transactionId)
                .orElseThrow(() -> new ResourceNotFoundException("Transaction not found with ID: " + transactionId));
        return mapToTransactionResponse(transaction);
    }

    public List<TransactionResponse> getAccountTransactionHistory(Long accountId) {
        accountRepository.findById(accountId)
                .orElseThrow(() -> new ResourceNotFoundException("Account not found with ID: " + accountId));

        return transactionRepository.findByFromAccountIdOrToAccountIdOrderByCreatedAtDesc(accountId, accountId)
                .stream()
                .map(this::mapToTransactionResponse)
                .collect(Collectors.toList());
    }

    public List<TransactionResponse> getTransactionsByType(String type) {
        try {
            Transaction.TransactionType transactionType = Transaction.TransactionType.valueOf(type.toUpperCase());
            return transactionRepository.findByTransactionTypeOrderByCreatedAtDesc(transactionType)
                    .stream()
                    .map(this::mapToTransactionResponse)
                    .collect(Collectors.toList());
        } catch (IllegalArgumentException e) {
            throw new InvalidOperationException("Invalid transaction type: " + type);
        }
    }

    public List<TransactionResponse> getAllTransactions() {
        return transactionRepository.findAll().stream()
                .map(this::mapToTransactionResponse)
                .collect(Collectors.toList());
    }

    private TransactionResponse mapToTransactionResponse(Transaction transaction) {
        return TransactionResponse.builder()
                .id(transaction.getId())
                .transactionType(transaction.getTransactionType().toString())
                .amount(transaction.getAmount())
                .currency(transaction.getCurrency())
                .fromAccountId(transaction.getFromAccountId())
                .toAccountId(transaction.getToAccountId())
                .fromAccountNumber(transaction.getFromAccount() != null ? transaction.getFromAccount().getAccountNumber() : null)
                .toAccountNumber(transaction.getToAccount() != null ? transaction.getToAccount().getAccountNumber() : null)
                .status(transaction.getStatus().toString())
                .description(transaction.getDescription())
                .referenceNumber(transaction.getReferenceNumber())
                .createdAt(transaction.getCreatedAt())
                .build();
    }
}
