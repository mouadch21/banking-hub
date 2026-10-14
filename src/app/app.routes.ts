
import { Routes } from '@angular/router';

import { Dashboard } from './components/dashboard/dashboard/dashboard';
import { CustomerList } from './components/customer/customer-list/customer-list';
import { CustomerForm } from './components/customer/customer-form/customer-form';

import { AccountList } from './components/account/account-list/account-list';
import { AccountForm } from './components/account/account-form/account-form';
import { AccountDetails } from './components/account/account-details/account-details';

import { TransactionList } from './components/transaction/transaction-list/transaction-list';
import { Deposit } from './components/transaction/deposit/deposit';
import { Withdraw } from './components/transaction/withdraw/withdraw';
import { Transfer } from './components/transaction/transfer/transfer';
import { AccountHistory } from './components/transaction/account-history/account-history';

export const routes: Routes = [
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' },

  { path: 'dashboard', component: Dashboard },

  { path: 'customers', component: CustomerList },
  { path: 'customers/new', component: CustomerForm },
  { path: 'customers/:id/edit', component: CustomerForm },

  { path: 'accounts', component: AccountList },
  { path: 'accounts/new', component: AccountForm },
  { path: 'accounts/:id', component: AccountDetails },

  { path: 'transactions', component: TransactionList },
  { path: 'transactions/deposit', component: Deposit },
  { path: 'transactions/withdraw', component: Withdraw },
  { path: 'transactions/transfer', component: Transfer },
  { path: 'accounts/:id/history', component: AccountHistory },

  { path: '**', redirectTo: 'dashboard' }
];
