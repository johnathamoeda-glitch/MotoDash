
export type AppType = 'Uber' | '99' | 'Outro';
export type ExpenseCategory = 'Combustível' | 'Manutenção' | 'Alimentação' | 'Seguro' | 'Outros';
export type FilterType = 'personalizado' | 'tudo';

export interface Earning {
  id: string;
  type: 'earning';
  date: string;
  app: AppType;
  amount: number;
  kmTraveled: number;
  hoursWorked: number;
}

export interface Expense {
  id: string;
  type: 'expense';
  date: string;
  category: ExpenseCategory;
  amount: number;
  description?: string;
}

export interface Goal {
  id: string;
  name: string;
  targetAmount: number;
  createdAt: string;
}

export type Transaction = Earning | Expense;

export interface DashboardStats {
  totalEarnings: number;
  totalExpenses: number;
  netProfit: number;
  avgPerHour: number;
  avgPerKm: number;
  totalKm: number;
  totalHours: number;
}
