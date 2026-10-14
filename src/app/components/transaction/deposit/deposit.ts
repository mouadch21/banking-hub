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
  selector: 'app-deposit',
  styleUrl: './deposit.css',
  templateUrl: './deposit.html',
})
export class Deposit implements OnInit {
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
    this.transactionApi.deposit(this.form.getRawValue()).subscribe({
      next: (response) => {
        if (!response.success) {
          this.errorMessage = response.message || 'Le dépôt a été refusé.';
          this.loading = false;
          this.changeDetector.markForCheck();
          return;
        }
        this.router.navigate(['/transactions']);
      },
      error: (error: HttpErrorResponse) => {
        this.errorMessage = this.getErrorMessage(error, 'Impossible d’effectuer le dépôt.');
        this.loading = false;
        this.changeDetector.markForCheck();
      },
    });
  }

  private getErrorMessage(error: HttpErrorResponse, fallback: string): string {
    const message = typeof error.error === 'string'
      ? error.error
      : error.error?.message ?? error.error?.detail;
    return message || `${fallback} (HTTP ${error.status || 'inconnu'}).`;
  }
}
