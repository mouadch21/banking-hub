package com.bankinghub.Controller;

import com.bankinghub.dto.*;
import com.bankinghub.service.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

// ======================== CUSTOMER CONTROLLER ========================

@RestController
@RequestMapping("/api/v1/customers")
@CrossOrigin(origins = "*")
public class CustomerController {

    @Autowired
    private CustomerService customerService;

    @PostMapping
    public ResponseEntity<ApiResponse<CustomerResponse>> createCustomer(@RequestBody CustomerRequest request) {
        CustomerResponse response = customerService.createCustomer(request);
        ApiResponse<CustomerResponse> apiResponse = new ApiResponse<>(
                true,
                "Customer created successfully",
                response
        );
        return ResponseEntity.status(HttpStatus.CREATED).body(apiResponse);
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<CustomerResponse>> getCustomer(@PathVariable Long id) {
        CustomerResponse response = customerService.getCustomer(id);
        ApiResponse<CustomerResponse> apiResponse = new ApiResponse<>(
                true,
                "Customer retrieved successfully",
                response
        );
        return ResponseEntity.ok(apiResponse);
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<CustomerResponse>>> getAllCustomers() {
        List<CustomerResponse> responses = customerService.getAllCustomers();
        ApiResponse<List<CustomerResponse>> apiResponse = new ApiResponse<>(
                true,
                "Customers retrieved successfully",
                responses
        );
        return ResponseEntity.ok(apiResponse);
    }

    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<CustomerResponse>> updateCustomer(
            @PathVariable Long id,
            @RequestBody CustomerRequest request) {
        CustomerResponse response = customerService.updateCustomer(id, request);
        ApiResponse<CustomerResponse> apiResponse = new ApiResponse<>(
                true,
                "Customer updated successfully",
                response
        );
        return ResponseEntity.ok(apiResponse);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<String>> deleteCustomer(@PathVariable Long id) {
        customerService.deleteCustomer(id);
        ApiResponse<String> apiResponse = new ApiResponse<>(
                true,
                "Customer deleted successfully",
                null
        );
        return ResponseEntity.ok(apiResponse);
    }

    @GetMapping("/search/{term}")
    public ResponseEntity<ApiResponse<List<CustomerResponse>>> searchCustomers(@PathVariable String term) {
        List<CustomerResponse> responses = customerService.searchCustomers(term);
        ApiResponse<List<CustomerResponse>> apiResponse = new ApiResponse<>(
                true,
                "Customers found",
                responses
        );
        return ResponseEntity.ok(apiResponse);
    }
}


