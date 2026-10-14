package com.bankinghub.Controller;

import com.bankinghub.dto.*;
import com.bankinghub.service.TransactionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/transactions")
@CrossOrigin(origins = "*")
public class TransactionController {

    @Autowired
    private TransactionService transactionService;

    @PostMapping("/deposit")
    public ResponseEntity<ApiResponse<TransactionResponse>> deposit(@RequestBody DepositRequest request) {
        TransactionResponse response = transactionService.deposit(request);
        ApiResponse<TransactionResponse> apiResponse = new ApiResponse<>(
                true,
                "Deposit completed successfully",
                response
        );
        return ResponseEntity.status(HttpStatus.CREATED).body(apiResponse);
    }

    @PostMapping("/withdraw")
    public ResponseEntity<ApiResponse<TransactionResponse>> withdraw(@RequestBody WithdrawRequest request) {
        TransactionResponse response = transactionService.withdraw(request);
        ApiResponse<TransactionResponse> apiResponse = new ApiResponse<>(
                true,
                "Withdrawal completed successfully",
                response
        );
        return ResponseEntity.status(HttpStatus.CREATED).body(apiResponse);
    }

    @PostMapping("/transfer")
    public ResponseEntity<ApiResponse<TransactionResponse>> transfer(@RequestBody TransferRequest request) {
        TransactionResponse response = transactionService.transfer(request);
        ApiResponse<TransactionResponse> apiResponse = new ApiResponse<>(
                true,
                "Transfer completed successfully",
                response
        );
        return ResponseEntity.status(HttpStatus.CREATED).body(apiResponse);
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<TransactionResponse>> getTransaction(@PathVariable Long id) {
        TransactionResponse response = transactionService.getTransaction(id);
        ApiResponse<TransactionResponse> apiResponse = new ApiResponse<>(
                true,
                "Transaction retrieved successfully",
                response
        );
        return ResponseEntity.ok(apiResponse);
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<TransactionResponse>>> getAllTransactions() {
        List<TransactionResponse> responses = transactionService.getAllTransactions();
        ApiResponse<List<TransactionResponse>> apiResponse = new ApiResponse<>(
                true,
                "Transactions retrieved successfully",
                responses
        );
        return ResponseEntity.ok(apiResponse);
    }

    @GetMapping("/account/{accountId}/history")
    public ResponseEntity<ApiResponse<List<TransactionResponse>>> getAccountTransactionHistory(
            @PathVariable Long accountId) {
        List<TransactionResponse> responses = transactionService.getAccountTransactionHistory(accountId);
        ApiResponse<List<TransactionResponse>> apiResponse = new ApiResponse<>(
                true,
                "Transaction history retrieved successfully",
                responses
        );
        return ResponseEntity.ok(apiResponse);
    }

    @GetMapping("/type/{type}")
    public ResponseEntity<ApiResponse<List<TransactionResponse>>> getTransactionsByType(@PathVariable String type) {
        List<TransactionResponse> responses = transactionService.getTransactionsByType(type);
        ApiResponse<List<TransactionResponse>> apiResponse = new ApiResponse<>(
                true,
                "Transactions retrieved successfully",
                responses
        );
        return ResponseEntity.ok(apiResponse);
    }
}
