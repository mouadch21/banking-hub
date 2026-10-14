
import { ChangeDetectorRef, Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';

import { forkJoin } from 'rxjs';
import { finalize } from 'rxjs/operators';

import { CustomerApi } from '../../../services/customer-api';
import { AccountApi } from '../../../services/account-api';
import { TransactionApi } from '../../../services/transaction-api';
import { CurrencyBalanceSummary, summarizeAccountBalances } from '../../../utils/account-balance-summary';

import {
  Customer,
  Account,
  Transaction
} from '../../../models/models';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css'
})
export class Dashboard implements OnInit {
  private readonly changeDetector = inject(ChangeDetectorRef);
  private customerApi = inject(CustomerApi);
  private accountApi = inject(AccountApi);
  private transactionApi = inject(TransactionApi);

  loading = false;
  errorMessage = '';

  customers: Customer[] = [];
  accounts: Account[] = [];
  recentTransactions: Transaction[] = [];

  totalCustomers = 0;
  totalAccounts = 0;
  currencyBalances: CurrencyBalanceSummary[] = [];

  ngOnInit(): void {
    this.loadDashboardData();
  }

  loadDashboardData(): void {
    this.loading = true;
    this.errorMessage = '';

    forkJoin({
      customers: this.customerApi.getAllCustomers(),
      accounts: this.accountApi.getAllAccounts(),
      transactions: this.transactionApi.getAllTransactions()
    })
      .pipe(finalize(() => {
        this.loading = false;
        this.changeDetector.markForCheck();
      }))
      .subscribe({
        next: (response) => {
          this.customers = response.customers.data ?? [];
          this.accounts = response.accounts.data ?? [];

          this.recentTransactions = [...(response.transactions.data ?? [])].sort(
            (left, right) => new Date(right.createdAt).getTime() - new Date(left.createdAt).getTime(),
          );

          this.totalCustomers = this.customers.length;
          this.totalAccounts = this.accounts.length;
          this.currencyBalances = summarizeAccountBalances(this.accounts);
        },
        error: (error) => {
          console.error('Erreur dashboard :', error);

          this.errorMessage =
            'Impossible de charger les données. Vérifiez que le backend Spring Boot fonctionne.';
        }
      });
  }

  getTransactionIcon(type: string): string {
    switch (type?.toUpperCase()) {
      case 'DEPOSIT':
        return '💵';
      case 'WITHDRAW':
        return '💸';
      case 'TRANSFER':
        return '🔄';
      default:
        return '💰';
    }
  }

  getStatusBadgeClass(status: string): string {
    switch (status?.toUpperCase()) {
      case 'SUCCESS':
        return 'bg-success';
      case 'FAILED':
        return 'bg-danger';
      case 'PENDING':
        return 'bg-warning text-dark';
      default:
        return 'bg-secondary';
    }
  }
}
