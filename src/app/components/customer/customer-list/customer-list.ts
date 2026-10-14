import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { Customer } from '../../../models/models';
import { CustomerApi } from '../../../services/customer-api';

@Component({
  imports: [CommonModule, FormsModule, RouterLink],
  selector: 'app-customer-list',
  styleUrl: './customer-list.css',
  templateUrl: './customer-list.html',
})
export class CustomerList implements OnInit {
  private readonly customerApi = inject(CustomerApi);
  private readonly changeDetector = inject(ChangeDetectorRef);

  customers: Customer[] = [];
  filteredCustomers: Customer[] = [];
  searchTerm = '';
  loading = false;

  ngOnInit(): void {
    this.loadCustomers();
  }

  loadCustomers(): void {
    this.loading = true;
    this.customerApi.getAllCustomers().subscribe({
      next: (response) => {
        this.customers = response.data ?? [];
        this.searchCustomers();
        this.loading = false;
        this.changeDetector.markForCheck();
      },
      error: () => {
        this.loading = false;
        this.changeDetector.markForCheck();
      },
    });
  }

  searchCustomers(): void {
    const query = this.searchTerm.trim().toLocaleLowerCase();
    this.filteredCustomers = this.customers.filter((customer) =>
      this.getFullName(customer).toLocaleLowerCase().includes(query),
    );
  }

  getFullName(customer: Customer): string {
    return [customer.firstName, customer.lastName].filter(Boolean).join(' ') || customer.name || '';
  }

  deleteCustomer(id: number): void {
    if (!window.confirm('Supprimer ce client ?')) {
      return;
    }

    this.customerApi.deleteCustomer(id).subscribe({
      next: () => {
        this.customers = this.customers.filter((customer) => customer.id !== id);
        this.searchCustomers();
        this.changeDetector.markForCheck();
      },
    });
  }
}
