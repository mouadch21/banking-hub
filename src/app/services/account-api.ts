
import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiResponse, Account, CreateAccountRequest } from '../models/models';

@Injectable({
  providedIn: 'root'
})
export class AccountApi {
  private http = inject(HttpClient);

  private readonly url =
    'http://localhost:8080/api/v1/accounts';

  getAllAccounts(): Observable<ApiResponse<Account[]>> {
    return this.http.get<ApiResponse<Account[]>>(this.url);
  }

  getAccount(id: number): Observable<ApiResponse<Account>> {
    return this.http.get<ApiResponse<Account>>(
      `${this.url}/${id}`
    );
  }

  createAccount(account: CreateAccountRequest): Observable<ApiResponse<Account>> {
    return this.http.post<ApiResponse<Account>>(this.url, account);
  }

  deleteAccount(id: number): Observable<void> {
    return this.http.delete<void>(`${this.url}/${id}`);
  }
}
