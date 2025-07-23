
export type GamePlatform = "PS5" | "PS4" | "PS3" | "VITA";

export interface Game {
  id: string;
  name: string;
  image?: string;
  banner?: string;
  platform: string[];
  description?: string;
  developer?: string;
  genre?: string;
  release_date?: string;
  rawg_id?: number;
  created_at: string;
  updated_at: string;
}

export interface Account {
  id: string;
  email: string;
  password: string;
  birthday?: string;
  security_answer?: string;
  codes?: string;
  qr_code?: string;
  created_at: string;
  updated_at: string;
  games?: Game[];
  slots?: AccountSlot[];
}

export interface AccountSlot {
  id: string;
  account_id: string;
  slot_number: number;
  user_id?: string;
  entered_at?: string;
  created_at: string;
  user?: User;
}

export interface Profile {
  id: string;
  name?: string;
  avatar_url?: string;
  role: 'admin' | 'member';
  created_at: string;
  updated_at: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'member';
  profile?: Profile;
  member?: Member;
  accounts?: Account[];
}

// Legacy interfaces for backward compatibility
export interface Member {
  id: string;
  name: string;
  email: string;
  password: string;
  psn_id: string;
  profile_image: string;
  created_at: Date;
  isApproved: boolean;
  payments: Payment[];
}

export interface Payment {
  id: string;
  member_id: string;
  amount: number;
  status: 'paid' | 'pending' | 'failed';
  month: number;
  year: number;
  paid_at: Date;
}

export interface SlotOccupation {
  member: Member;
  entered_at: Date;
}
