export interface Game {
  id: string;
  name: string;
  image: string;
  banner: string;
  created_at: Date;
  platform: GamePlatform[];
  accounts?: Account[];
}

export type GamePlatform = "PS5" | "PS4" | "PS3" | "VITA" | "VR" | "PC";

export interface Account {
  id: string;
  name: string;
  email: string;
  password: string;
  code: string;
  qrcode: string;
  created_at: Date;
  birthday: Date;
  response: string;
  games?: Game[];
  slot1?: SlotOccupation;
  slot2?: SlotOccupation;
}

export interface SlotOccupation {
  member: Member;
  entered_at: Date;
  left_at?: Date;
}

export interface Member {
  id: string;
  name: string;
  email: string;
  password: string;
  psn_id: string;
  profile_image?: string;
  created_at: Date;
  isApproved: boolean;
  accounts?: SlotOccupation[];
  payments: Payment[];
}

export interface Payment {
  id: string;
  member_id: string;
  month: number;
  year: number;
  amount: number;
  paid_at: Date;
  status: "pending" | "paid" | "failed";
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: "admin" | "member";
  member?: Member;
}
