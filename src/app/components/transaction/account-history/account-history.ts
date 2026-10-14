import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { Transaction } from '../../../models/models';
import { TransactionApi } from '../../../services/transaction-api';

@Component({
  imports: [CommonModule, RouterLink],
  selector: 'app-account-history',
  styleUrl: './account-history.css',
  templateUrl: './account-history.html',
})
export class AccountHistory implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly transactionApi = inject(TransactionApi);
  private readonly changeDetector = inject(ChangeDetectorRef);

  accountId = 0;
  transactions: Transaction[] = [];
  loading = false;
  errorMessage = '';

  ngOnInit(): void {
    this.accountId = Number(this.route.snapshot.paramMap.get('id'));
    if (!Number.isInteger(this.accountId) || this.accountId <= 0) {
      this.errorMessage = 'Identifiant de compte invalide.';
      return;
    }

    this.loading = true;
    this.transactionApi.getAccountHistory(this.accountId).subscribe({
      next: (response) => {
        this.transactions = response.data ?? [];
        this.loading = false;
        this.changeDetector.markForCheck();
      },
      error: () => {
        this.errorMessage = 'Impossible de charger l’historique de ce compte.';
        this.loading = false;
        this.changeDetector.markForCheck();
      },
    });
  }
}
