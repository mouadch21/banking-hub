package com.bankinghub.Controller;

import com.bankinghub.dto.AccountDetailsResponse;
import com.bankinghub.dto.AccountResponse;
import com.bankinghub.dto.ApiResponse;
import com.bankinghub.dto.CreateAccountRequest;
import com.bankinghub.service.AccountService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/accounts")
@CrossOrigin(origins = "*")
public class AccountController {

    @Autowired
    private AccountService accountService;

    @PostMapping
    public ResponseEntity<ApiResponse<AccountResponse>> createAccount(@RequestBody CreateAccountRequest request) {
        AccountResponse response = accountService.createAccount(request);
        ApiResponse<AccountResponse> apiResponse = new ApiResponse<>(
                true,
                "Account created successfully",
                response
        );
        return ResponseEntity.status(HttpStatus.CREATED).body(apiResponse);
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<AccountResponse>> getAccount(@PathVariable Long id) {
        AccountResponse response = accountService.getAccount(id);
        ApiResponse<AccountResponse> apiResponse = new ApiResponse<>(
                true,
                "Account retrieved successfully",
                response
        );
        return ResponseEntity.ok(apiResponse);
    }

    @GetMapping("/{id}/details")
    public ResponseEntity<ApiResponse<AccountDetailsResponse>> getAccountDetails(@PathVariable Long id) {
        AccountDetailsResponse response = accountService.getAccountDetails(id);
        ApiResponse<AccountDetailsResponse> apiResponse = new ApiResponse<>(
                true,
                "Account details retrieved successfully",
                response
        );
        return ResponseEntity.ok(apiResponse);
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<AccountResponse>>> getAllAccounts() {
        List<AccountResponse> responses = accountService.getAllAccounts();
        ApiResponse<List<AccountResponse>> apiResponse = new ApiResponse<>(
                true,
                "Accounts retrieved successfully",
                responses
        );
        return ResponseEntity.ok(apiResponse);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<String>> deleteAccount(@PathVariable Long id) {
        accountService.deleteAccount(id);
        ApiResponse<String> apiResponse = new ApiResponse<>(
                true,
                "Account deleted successfully",
                "Account deleted successfully"
        );
        return ResponseEntity.ok(apiResponse);
    }

    @GetMapping("/customer/{customerId}")
    public ResponseEntity<ApiResponse<List<AccountResponse>>> getCustomerAccounts(@PathVariable Long customerId) {
        List<AccountResponse> responses = accountService.getCustomerAccounts(customerId);
        ApiResponse<List<AccountResponse>> apiResponse = new ApiResponse<>(
                true,
                "Customer accounts retrieved successfully",
                responses
        );
        return ResponseEntity.ok(apiResponse);
    }

    @GetMapping("/{id}/balance")
    public ResponseEntity<ApiResponse<Object>> getBalance(@PathVariable Long id) {
        Object balance = accountService.getBalance(id);
        ApiResponse<Object> apiResponse = new ApiResponse<>(
                true,
                "Balance retrieved successfully",
                balance
        );
        return ResponseEntity.ok(apiResponse);
    }

    @PutMapping("/{id}/status")
    public ResponseEntity<ApiResponse<AccountResponse>> updateAccountStatus(
            @PathVariable Long id,
            @RequestParam String status) {
        AccountResponse response = accountService.updateAccountStatus(id, status);
        ApiResponse<AccountResponse> apiResponse = new ApiResponse<>(
                true,
                "Account status updated successfully",
                response
        );
        return ResponseEntity.ok(apiResponse);
    }
}
