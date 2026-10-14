import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { Account, Customer } from '../../../models/models';
import { AccountApi } from '../../../services/account-api';
import { CustomerApi } from '../../../services/customer-api';

@Component({
  imports: [CommonModule, RouterLink],
  selector: 'app-account-details',
  styleUrl: './account-details.css',
  templateUrl: './account-details.html',
})
export class AccountDetails implements OnInit {
  private readonly changeDetector = inject(ChangeDetectorRef);
  private readonly accountApi = inject(AccountApi);
  private readonly customerApi = inject(CustomerApi);
  private readonly route = inject(ActivatedRoute);

  account?: Account;
  customer?: Customer;
  loading = false;
  loadingCustomer = false;

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    if (!Number.isInteger(id) || id <= 0) {
      return;
    }

    this.loading = true;
    this.accountApi.getAccount(id).subscribe({
      next: (response) => {
        this.account = response.data;
        this.loading = false;
        if (this.account.customer) {
          this.customer = this.account.customer;
        } else if (this.account.customerId) {
          this.loadCustomer(this.account.customerId);
        }
        this.changeDetector.markForCheck();
      },
      error: () => {
        this.loading = false;
        this.changeDetector.markForCheck();
      },
    });
  }

  getAccountTypeLabel(type?: string): string {
    return type || 'Compte bancaire';
  }

  getCustomerName(customer: Customer): string {
    return [customer.firstName, customer.lastName].filter(Boolean).join(' ') || customer.name || '—';
  }

  private loadCustomer(customerId: number): void {
    this.loadingCustomer = true;
    this.customerApi.getCustomer(customerId).subscribe({
      next: (response) => {
        this.customer = response.data;
        this.loadingCustomer = false;
        this.changeDetector.markForCheck();
      },
      error: () => {
        this.loadingCustomer = false;
        this.changeDetector.markForCheck();
      },
    });
  }
}
