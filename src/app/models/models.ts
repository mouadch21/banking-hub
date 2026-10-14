
export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

export interface Customer {
  id: number;
  firstName?: string;
  lastName?: string;
  name?: string;
  email?: string;
  phone?: string;
  address?: string;
  city?: string;
  country?: string;
  createdAt?: string;
}

export interface Account {
  id: number;
  accountNumber?: string;
  accountType?: string;
  customerId?: number;
  customer?: Customer;
  balance: number;
  currency?: string;
  status?: string;
  createdAt?: string;
}

export interface CreateAccountRequest {
  customerId: number;
  accountType: string;
  initialBalance: number;
  currency: string;
}

export interface DepositRequest {
  accountId: number;
  amount: number;
  description?: string;
}

export interface WithdrawRequest {
  accountId: number;
  amount: number;
  description?: string;
}

export interface TransferRequest {
  fromAccountId: number;
  toAccountId: number;
  amount: number;
  description?: string;
}

export interface Transaction {
  id: number;
  transactionType: string;
  amount: number;
  currency?: string;
  fromAccountId?: number;
  toAccountId?: number;
  status: string;
  fromAccountNumber?: string;
  toAccountNumber?: string;
  description?: string;
  referenceNumber?: string;
  createdAt: string;
}
