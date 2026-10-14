
import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import {
  ApiResponse,
  DepositRequest,
  Transaction,
  TransferRequest,
  WithdrawRequest,
} from '../models/models';

@Injectable({
  providedIn: 'root'
})
export class TransactionApi {
  private http = inject(HttpClient);

  private readonly url =
    'http://localhost:8080/api/v1/transactions';

  getAllTransactions(): Observable<ApiResponse<Transaction[]>> {
    return this.http.get<ApiResponse<Transaction[]>>(this.url);
  }

  getAccountHistory(accountId: number): Observable<ApiResponse<Transaction[]>> {
    return this.http.get<ApiResponse<Transaction[]>>(
      `${this.url}/account/${accountId}/history`,
    );
  }

  deposit(request: DepositRequest): Observable<ApiResponse<Transaction>> {
    return this.http.post<ApiResponse<Transaction>>(`${this.url}/deposit`, request);
  }

  withdraw(request: WithdrawRequest): Observable<ApiResponse<Transaction>> {
    return this.http.post<ApiResponse<Transaction>>(`${this.url}/withdraw`, request);
  }

  transfer(request: TransferRequest): Observable<ApiResponse<Transaction>> {
    return this.http.post<ApiResponse<Transaction>>(`${this.url}/transfer`, request);
  }
}
