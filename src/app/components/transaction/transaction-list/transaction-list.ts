import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Transaction } from '../../../models/models';
import { TransactionApi } from '../../../services/transaction-api';

@Component({
  imports: [CommonModule, RouterLink],
  selector: 'app-transaction-list',
  styleUrl: './transaction-list.css',
  templateUrl: './transaction-list.html',
})
export class TransactionList implements OnInit {
  private readonly transactionApi = inject(TransactionApi);
  private readonly changeDetector = inject(ChangeDetectorRef);

  transactions: Transaction[] = [];
  loading = false;
  errorMessage = '';

  ngOnInit(): void {
    this.loading = true;
    this.transactionApi.getAllTransactions().subscribe({
      next: (response) => {
        this.transactions = response.data ?? [];
        this.loading = false;
        this.errorMessage = '';
        this.changeDetector.markForCheck();
      },
      error: () => {
        this.loading = false;
        this.errorMessage = 'Impossible de charger les transactions.';
        this.changeDetector.markForCheck();
      },
    });
  }

  getTransactionBadgeClass(type: string): string {
    switch (type.toUpperCase()) {
      case 'DEPOSIT':
        return 'bg-success';
      case 'WITHDRAWAL':
      case 'WITHDRAW':
        return 'bg-warning';
      case 'TRANSFER':
        return 'bg-info';
      default:
        return 'bg-secondary';
    }
  }

  getTransactionIcon(type: string): string {
    switch (type.toUpperCase()) {
      case 'DEPOSIT':
        return '+';
      case 'WITHDRAWAL':
      case 'WITHDRAW':
        return '-';
      case 'TRANSFER':
        return '<->';
      default:
        return '?';
    }
  }

  getStatusBadgeClass(status: string): string {
    switch (status.toUpperCase()) {
      case 'COMPLETED':
      case 'SUCCESS':
        return 'bg-success';
      case 'PENDING':
        return 'bg-warning';
      case 'FAILED':
      case 'CANCELLED':
        return 'bg-danger';
      default:
        return 'bg-secondary';
    }
  }
}
