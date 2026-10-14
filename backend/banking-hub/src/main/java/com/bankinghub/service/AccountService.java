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

@Service
public class AccountService {

    @Autowired
    private AccountRepository accountRepository;

    @Autowired
    private CustomerRepository customerRepository;

    @Transactional
    public AccountResponse createAccount(CreateAccountRequest request) {
        Customer customer = customerRepository.findById(request.getCustomerId())
                .orElseThrow(() -> new ResourceNotFoundException("Customer not found with ID: " + request.getCustomerId()));

        String accountNumber = generateAccountNumber();

        Account account = Account.builder()
                .accountNumber(accountNumber)
                .accountType(Account.AccountType.valueOf(request.getAccountType().toUpperCase()))
                .balance(request.getInitialBalance() != null ? request.getInitialBalance() : BigDecimal.ZERO)
                .currency(request.getCurrency() != null ? request.getCurrency() : "USD")
                .customerId(customer.getId())
                .status(Account.AccountStatus.ACTIVE)
                .build();

        Account savedAccount = accountRepository.save(account);
        return mapToAccountResponse(savedAccount);
    }

    public AccountDetailsResponse getAccountDetails(Long accountId) {
        Account account = accountRepository.findById(accountId)
                .orElseThrow(() -> new ResourceNotFoundException("Account not found with ID: " + accountId));
        return mapToAccountDetailsResponse(account);
    }

    public AccountResponse getAccount(Long accountId) {
        Account account = accountRepository.findById(accountId)
                .orElseThrow(() -> new ResourceNotFoundException("Account not found with ID: " + accountId));
        return mapToAccountResponse(account);
    }

    public List<AccountResponse> getCustomerAccounts(Long customerId) {
        customerRepository.findById(customerId)
                .orElseThrow(() -> new ResourceNotFoundException("Customer not found with ID: " + customerId));

        return accountRepository.findByCustomerId(customerId).stream()
                .map(this::mapToAccountResponse)
                .collect(Collectors.toList());
    }

    public List<AccountResponse> getAllAccounts() {
        return accountRepository.findAll().stream()
                .map(this::mapToAccountResponse)
                .collect(Collectors.toList());
    }

    @Transactional
    public void deleteAccount(Long accountId) {
        if (accountRepository.deleteAccountPreservingTransactions(accountId) == 0) {
            throw new ResourceNotFoundException("Account not found with ID: " + accountId);
        }
    }

    @Transactional
    public AccountResponse updateAccountStatus(Long accountId, String status) {
        Account account = accountRepository.findById(accountId)
                .orElseThrow(() -> new ResourceNotFoundException("Account not found with ID: " + accountId));

        try {
            account.setStatus(Account.AccountStatus.valueOf(status.toUpperCase()));
            Account updatedAccount = accountRepository.save(account);
            return mapToAccountResponse(updatedAccount);
        } catch (IllegalArgumentException e) {
            throw new InvalidOperationException("Invalid account status: " + status);
        }
    }

    public BigDecimal getBalance(Long accountId) {
        Account account = accountRepository.findById(accountId)
                .orElseThrow(() -> new ResourceNotFoundException("Account not found with ID: " + accountId));
        return account.getBalance();
    }

    @Transactional
    protected void updateBalance(Long accountId, BigDecimal newBalance) {
        Account account = accountRepository.findById(accountId)
                .orElseThrow(() -> new ResourceNotFoundException("Account not found with ID: " + accountId));
        account.setBalance(newBalance);
        accountRepository.save(account);
    }

    private synchronized String generateAccountNumber() {
        long sequence = accountRepository.count() + 1;
        String accountNumber;
        do {
            accountNumber = String.format("ACC%03d", sequence++);
        } while (accountRepository.existsByAccountNumber(accountNumber));
        return accountNumber;
    }

    private AccountResponse mapToAccountResponse(Account account) {
        return AccountResponse.builder()
                .id(account.getId())
                .accountNumber(account.getAccountNumber())
                .accountType(account.getAccountType().toString())
                .balance(account.getBalance())
                .currency(account.getCurrency())
                .customerId(account.getCustomerId())
                .status(account.getStatus().toString())
                .createdAt(account.getCreatedAt())
                .updatedAt(account.getUpdatedAt())
                .build();
    }

    private AccountDetailsResponse mapToAccountDetailsResponse(Account account) {
        Customer customer = customerRepository.findById(account.getCustomerId()).orElse(null);
        CustomerResponse customerResponse = null;
        if (customer != null) {
            customerResponse = CustomerResponse.builder()
                    .id(customer.getId())
                    .firstName(customer.getFirstName())
                    .lastName(customer.getLastName())
                    .email(customer.getEmail())
                    .build();
        }

        return AccountDetailsResponse.builder()
                .id(account.getId())
                .accountNumber(account.getAccountNumber())
                .accountType(account.getAccountType().toString())
                .balance(account.getBalance())
                .currency(account.getCurrency())
                .customer(customerResponse)
                .status(account.getStatus().toString())
                .createdAt(account.getCreatedAt())
                .updatedAt(account.getUpdatedAt())
                .build();
    }
}
