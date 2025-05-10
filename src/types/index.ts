export type GamePlatform = "PS5" | "PS4" | "PS3" | "VITA" | "VR";

export interface Game {
  id: string;
  name: string;
  image: string;
  banner: string;
  platform: GamePlatform[];
  created_at: Date;
  referenceLink?: string;
  description?: string;
  releaseDate?: string;
  developer?: string;
  genre?: string;
}

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

export interface Account {
  id: string;
  email: string;
  password: string;
  code?: string;
  created_at: Date;
  qrcode?: string;
  image?: string;
  games?: Game[];
  slot1?: {
    member: Member;
    entered_at: Date;
  };
  slot2?: {
    member: Member;
    entered_at: Date;
  };
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'member';
  member?: Member;
}
