import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { CustomerApi } from '../../../services/customer-api';

@Component({
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  selector: 'app-customer-form',
  styleUrl: './customer-form.css',
  templateUrl: './customer-form.html',
})
export class CustomerForm implements OnInit {
  private readonly formBuilder = inject(FormBuilder);
  private readonly customerApi = inject(CustomerApi);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  private readonly changeDetector = inject(ChangeDetectorRef);

  readonly form = this.formBuilder.nonNullable.group({
    firstName: ['', [Validators.required, Validators.minLength(2)]],
    lastName: ['', [Validators.required, Validators.minLength(2)]],
    email: ['', [Validators.required, Validators.email]],
    phone: [''],
    address: [''],
    city: [''],
    country: [''],
  });
  private initialFormValue = this.form.getRawValue();
  customerId: number | null = null;
  submitted = false;
  loading = false;
  errorMessage = '';

  get f() {
    return this.form.controls;
  }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (!id) {
      return;
    }

    this.customerId = Number(id);
    if (!Number.isInteger(this.customerId) || this.customerId <= 0) {
      this.errorMessage = 'Identifiant client invalide.';
      return;
    }

    this.loading = true;
    this.customerApi.getCustomer(this.customerId).subscribe({
      next: (response) => {
        const customer = response.data;
        this.form.patchValue({
          firstName: customer.firstName ?? '',
          lastName: customer.lastName ?? '',
          email: customer.email ?? '',
          phone: customer.phone ?? '',
          address: customer.address ?? '',
          city: customer.city ?? '',
          country: customer.country ?? '',
        });
        this.initialFormValue = this.form.getRawValue();
        this.loading = false;
        this.changeDetector.markForCheck();
      },
      error: () => {
        this.errorMessage = 'Impossible de charger ce client.';
        this.loading = false;
        this.changeDetector.markForCheck();
      },
    });
  }

  onSubmit(): void {
    this.submitted = true;
    this.errorMessage = '';
    if (this.form.invalid || this.loading) {
      return;
    }

    this.loading = true;
    const request = this.customerId === null
      ? this.customerApi.createCustomer(this.form.getRawValue())
      : this.customerApi.updateCustomer(this.customerId, this.form.getRawValue());

    request.subscribe({
      next: () => this.router.navigate(['/customers']),
      error: () => {
        this.errorMessage = this.customerId === null
          ? 'Impossible de créer ce client. Vérifiez les informations et réessayez.'
          : 'Impossible de modifier ce client. Vérifiez les informations et réessayez.';
        this.loading = false;
        this.changeDetector.markForCheck();
      },
    });
  }

  resetForm(): void {
    this.submitted = false;
    this.errorMessage = '';
    this.form.reset(this.initialFormValue);
  }
}
