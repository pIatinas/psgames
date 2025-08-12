
export interface Game {
  id: string;
  name: string;
  image: string;
  banner: string;
  platform: GamePlatform[];
  description: string;
  developer: string;
  genre: string;
  release_date: string;
  launch_date?: string;
  platinum?: number;
  gold?: number;
  silver?: number;
  bronze?: number;
  rawg_id?: number;
  created_at: string;
  updated_at: string;
}

export type GamePlatform = "PS5" | "PS4" | "PS3" | "VITA";

export interface Payment {
  id: string;
  member_id: string;
  month: number;
  year: number;
  amount: number;
  paid_at: string;
  status: 'paid' | 'pending';
}

export interface Account {
  id: string;
  email: string;
  password?: string;
  birthday?: string;
  security_answer?: string;
  codes?: string;
  qr_code?: string;
  games?: Game[];
  slots?: AccountSlot[];
  created_at: string;
  updated_at: string;
}

export interface AccountSlot {
  id: string;
  account_id: string;
  slot_number: 1 | 2;
  user_id?: string;
  entered_at?: string;
  created_at: string;
  user?: {
    id: string;
    name: string;
    active: boolean;
  };
}

export interface Member {
  id: string;
  name: string;
  email: string;
  password?: string;
  psn_id?: string;
  profile_image?: string;
  isApproved: boolean;
  created_at: string;
  updated_at: string;
  accounts?: Account[];
  payments?: Payment[];
}

export type UserRole = 'admin' | 'member';

export interface UserRoleData {
  id: string;
  user_id: string;
  role: UserRole;
  created_at: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  active: boolean;
  profile?: {
    id: string;
    name?: string;
    avatar_url?: string;
    role: UserRole;
    active: boolean;
    created_at: string;
    updated_at: string;
  };
  roles?: UserRoleData[];
}
