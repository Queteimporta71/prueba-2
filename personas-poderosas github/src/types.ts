export type Role = 'user' | 'admin';

export interface UserProfile {
  name: string;
  email: string;
  isActive: boolean;
  isAdmin: boolean;
  codeUsed: string;
  createdAt: number;
}

export interface Activity {
  id: string;
  name: string;
  goal: number; // The target quantity for the month
}

export interface Area {
  id: string;
  name: string;
  activities: Activity[];
}

export interface Dimension {
  id: string;
  name: string;
  areas: Area[];
}

// User-specific Plan
export interface Plan {
  dimensions: Dimension[];
  updatedAt: number;
}

// User-specific Monthly Progress
export interface MonthlyProgress {
  month: string; // YYYY-MM
  days: Record<string, Record<string, number>>; // key: "YYYY-MM-DD", val: { "dim_area_act": number }
  updatedAt: number;
}
