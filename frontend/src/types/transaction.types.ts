export interface Transaction {
  id: string;
  type: 'DEBIT' | 'CREDIT';
  amount: number;
  description: string;
  serviceId?: string;
  serviceName?: string;
  reservationId?: string;
  relatedUserId?: string;
  relatedUserName?: string;
  createdAt: Date;
}

export interface TransactionFilters {
  type?: 'DEBIT' | 'CREDIT';
  startDate?: string;
  endDate?: string;
}
