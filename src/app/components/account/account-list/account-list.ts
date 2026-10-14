import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { Account, Customer } from '../../../models/models';
import { AccountApi } from '../../../services/account-api';
import { CustomerApi } from '../../../services/customer-api';
import { CurrencyBalanceSummary, summarizeAccountBalances } from '../../../utils/account-balance-summary';

@Component({
  imports: [CommonModule, RouterLink],
  selector: 'app-account-list',
  styleUrl: './account-list.css',
  templateUrl: './account-list.html',
})
export class AccountList implements OnInit {
  private readonly changeDetector = inject(ChangeDetectorRef);
  private readonly accountApi = inject(AccountApi);
  private readonly customerApi = inject(CustomerApi);
  private readonly router = inject(Router);

  accounts: Account[] = [];
  customers: Customer[] = [];
  loading = false;

  get totalAccounts(): number {
    return this.accounts.length;
  }

  get currencyBalances(): CurrencyBalanceSummary[] {
    return summarizeAccountBalances(this.accounts);
  }

  ngOnInit(): void {
    this.loading = true;
    this.accountApi.getAllAccounts().subscribe({
      next: (response) => {
        this.accounts = response.data ?? [];
        this.loading = false;
        this.changeDetector.markForCheck();
      },
      error: () => {
        this.loading = false;
        this.changeDetector.markForCheck();
      },
    });
    this.customerApi.getAllCustomers().subscribe({
      next: (response) => {
        this.customers = response.data ?? [];
        this.changeDetector.markForCheck();
      },
    });
  }

  getAccountTypeIcon(type?: string): string {
    return type?.toUpperCase() === 'SAVINGS' ? '💰' : '💳';
  }

  getCustomerName(customerId?: number): string {
    const customer = this.customers.find((item) => item.id === customerId);
    return customer
      ? [customer.firstName, customer.lastName].filter(Boolean).join(' ') || customer.name || ''
      : '-';
  }

  selectAccount(account: Account): void {
    this.router.navigate(['/accounts', account.id]);
  }

  deleteAccount(id: number): void {
    if (!window.confirm('Supprimer ce compte ?')) {
      return;
    }

    this.accountApi.deleteAccount(id).subscribe({
      next: () => {
        this.accounts = this.accounts.filter((account) => account.id !== id);
        this.changeDetector.markForCheck();
      },
    });
  }
}
