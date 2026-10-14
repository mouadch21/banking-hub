
import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiResponse, Customer } from '../models/models';

@Injectable({
  providedIn: 'root'
})
export class CustomerApi {
  private http = inject(HttpClient);

  private readonly url =
    'http://localhost:8080/api/v1/customers';

  getAllCustomers(): Observable<ApiResponse<Customer[]>> {
    return this.http.get<ApiResponse<Customer[]>>(this.url);
  }

  getCustomer(id: number): Observable<ApiResponse<Customer>> {
    return this.http.get<ApiResponse<Customer>>(
      `${this.url}/${id}`
    );
  }

  createCustomer(customer: Omit<Customer, 'id'>): Observable<ApiResponse<Customer>> {
    return this.http.post<ApiResponse<Customer>>(this.url, customer);
  }

  updateCustomer(id: number, customer: Omit<Customer, 'id'>): Observable<ApiResponse<Customer>> {
    return this.http.put<ApiResponse<Customer>>(`${this.url}/${id}`, customer);
  }

  deleteCustomer(id: number): Observable<void> {
    return this.http.delete<void>(`${this.url}/${id}`);
  }
}
