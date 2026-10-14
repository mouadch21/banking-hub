import { CommonModule } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { ChangeDetectorRef, Component, OnInit, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { Customer } from '../../../models/models';
import { AccountApi } from '../../../services/account-api';
import { CustomerApi } from '../../../services/customer-api';

@Component({
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  selector: 'app-account-form',
  styleUrl: './account-form.css',
  templateUrl: './account-form.html',
})
export class AccountForm implements OnInit {
  private readonly formBuilder = inject(FormBuilder);
  private readonly accountApi = inject(AccountApi);
  private readonly customerApi = inject(CustomerApi);
  private readonly router = inject(Router);
  private readonly changeDetector = inject(ChangeDetectorRef);

  readonly form = this.formBuilder.nonNullable.group({
    customerId: [0, [Validators.required, Validators.min(1)]],
    accountType: ['CHECKING', Validators.required],
    initialBalance: [0, [Validators.required, Validators.min(0)]],
    currency: ['USD', [Validators.required, Validators.minLength(3), Validators.maxLength(3)]],
  });
  customers: Customer[] = [];
  loadingCustomers = false;
  loading = false;
  submitted = false;
  errorMessage = '';

  get f() {
    return this.form.controls;
  }

  ngOnInit(): void {
    this.loadingCustomers = true;
    this.customerApi.getAllCustomers().subscribe({
      next: (response) => {
        this.customers = response.data ?? [];
        this.loadingCustomers = false;
        this.changeDetector.markForCheck();
      },
      error: () => {
        this.loadingCustomers = false;
        this.errorMessage = 'Impossible de charger les clients. Vérifiez la connexion au serveur.';
        this.changeDetector.markForCheck();
      },
    });
  }

  getCustomerName(customer: Customer): string {
    return [customer.firstName, customer.lastName].filter(Boolean).join(' ') || customer.name || customer.email || `Client ${customer.id}`;
  }

  onSubmit(): void {
    this.submitted = true;
    this.errorMessage = '';
    if (this.form.invalid || this.loading) {
      return;
    }

    this.loading = true;
    this.accountApi.createAccount(this.form.getRawValue()).subscribe({
      next: (response) => {
        if (!response.success) {
          this.errorMessage = response.message || 'Le serveur a refusé la création du compte.';
          this.loading = false;
          this.changeDetector.markForCheck();
          return;
        }
        this.router.navigate(['/accounts']);
      },
      error: (error: HttpErrorResponse) => {
        const responseMessage = typeof error.error === 'string'
          ? error.error
          : error.error?.message ?? error.error?.detail ?? error.error?.error;
        this.errorMessage = responseMessage
          ? `Création refusée : ${responseMessage}`
          : `Le serveur a refusé la création (HTTP ${error.status}). Vérifiez le titulaire, le type, le solde et la devise.`;
        console.error('Erreur API lors de la création du compte', error);
        this.loading = false;
        this.changeDetector.markForCheck();
      },
    });
  }

  resetForm(): void {
    this.form.reset({
      customerId: 0,
      accountType: 'CHECKING',
      initialBalance: 0,
      currency: 'USD',
    });
    this.submitted = false;
    this.errorMessage = '';
  }
}
