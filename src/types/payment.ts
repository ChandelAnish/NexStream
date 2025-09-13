// types/models.ts

export type PaymentMode = 'Cash' | 'Online';
export type PaymentStatus = 'Failed' | 'Paid' | 'Refunded' | 'Cancel' | 'Pending';

export interface Payment {
  id?: number;
  avatar?: string;
  payerName: string;
  amount: number;
  paymentDate: string; // ISO date string
  receiveDate: string;
  transactionId: string;
  paymentMode: PaymentMode;
  status: PaymentStatus;
  createdAt?: string;
  updatedAt?: string;
}