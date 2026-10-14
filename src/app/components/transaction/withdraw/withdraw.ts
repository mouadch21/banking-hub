import { CommonModule } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { ChangeDetectorRef, Component, OnInit, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { Account } from '../../../models/models';
import { AccountApi } from '../../../services/account-api';
import { TransactionApi } from '../../../services/transaction-api';

@Component({
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  selector: 'app-withdraw',
  styleUrl: './withdraw.css',
  templateUrl: './withdraw.html',
})
export class Withdraw implements OnInit {
  private readonly formBuilder = inject(FormBuilder);
  private readonly accountApi = inject(AccountApi);
  private readonly transactionApi = inject(TransactionApi);
  private readonly router = inject(Router);
  private readonly changeDetector = inject(ChangeDetectorRef);

  readonly form = this.formBuilder.nonNullable.group({
    accountId: [0, [Validators.required, Validators.min(1)]],
    amount: [0, [Validators.required, Validators.min(0.01)]],
    description: [''],
  });
  accounts: Account[] = [];
  submitted = false;
  loading = false;
  errorMessage = '';

  get f() {
    return this.form.controls;
  }

  getSelectedCurrency(): string {
    return this.accounts.find((account) => account.id === this.f['accountId'].value)?.currency || 'USD';
  }

  ngOnInit(): void {
    this.accountApi.getAllAccounts().subscribe({
      next: (response) => {
        this.accounts = (response.data ?? []).filter((account) => account.status === 'ACTIVE');
        this.changeDetector.markForCheck();
      },
      error: () => this.changeDetector.markForCheck(),
    });
  }

  onSubmit(): void {
    this.submitted = true;
    this.errorMessage = '';
    if (this.form.invalid || this.loading) {
      return;
    }

    this.loading = true;
    this.transactionApi.withdraw(this.form.getRawValue()).subscribe({
      next: (response) => {
        if (!response.success) {
          this.errorMessage = response.message || 'Le retrait a été refusé.';
          this.loading = false;
          this.changeDetector.markForCheck();
          return;
        }
        this.router.navigate(['/transactions']);
      },
      error: (error: HttpErrorResponse) => {
        const message = typeof error.error === 'string'
          ? error.error
          : error.error?.message ?? error.error?.detail;
        this.errorMessage = message || `Impossible d’effectuer le retrait (HTTP ${error.status || 'inconnu'}).`;
        this.loading = false;
        this.changeDetector.markForCheck();
      },
    });
  }
}
