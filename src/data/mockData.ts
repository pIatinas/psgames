
import { Account, Game, GamePlatform, Member, Payment, SlotOccupation, User } from "../types";

// Helper para criar datas em um formato mais legível
const createDate = (daysAgo = 0) => {
  const date = new Date();
  date.setDate(date.getDate() - daysAgo);
  return date;
};

// Dados de jogos
export const games: Game[] = [
  {
    id: "1",
    name: "God of War Ragnarök",
    image: "https://images.unsplash.com/photo-1621259182978-fbf93132d53d?q=80&w=300&h=400&fit=crop",
    banner: "https://images.unsplash.com/photo-1621259182978-fbf93132d53d?q=80&w=1920&h=500&fit=crop",
    created_at: createDate(30),
    platform: ["PS5"],
  },
  {
    id: "2",
    name: "Horizon Forbidden West",
    image: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=300&h=400&fit=crop",
    banner: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=1920&h=500&fit=crop",
    created_at: createDate(25),
    platform: ["PS5", "PS4"],
  },
  {
    id: "3",
    name: "Marvel's Spider-Man 2",
    image: "https://images.unsplash.com/photo-1608889335941-32ac5f2041b9?q=80&w=300&h=400&fit=crop",
    banner: "https://images.unsplash.com/photo-1608889335941-32ac5f2041b9?q=80&w=1920&h=500&fit=crop",
    created_at: createDate(20),
    platform: ["PS5"],
  },
  {
    id: "4",
    name: "Final Fantasy XVI",
    image: "https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=300&h=400&fit=crop",
    banner: "https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=1920&h=500&fit=crop",
    created_at: createDate(15),
    platform: ["PS5"],
  },
  {
    id: "5",
    name: "Ratchet & Clank: Rift Apart",
    image: "https://images.unsplash.com/photo-1534423861386-85a16f5d13fd?q=80&w=300&h=400&fit=crop",
    banner: "https://images.unsplash.com/photo-1534423861386-85a16f5d13fd?q=80&w=1920&h=500&fit=crop",
    created_at: createDate(10),
    platform: ["PS5"],
  },
  {
    id: "6",
    name: "Demon's Souls",
    image: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=300&h=400&fit=crop",
    banner: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=1920&h=500&fit=crop",
    created_at: createDate(5),
    platform: ["PS5"],
  },
  {
    id: "7",
    name: "Returnal",
    image: "https://images.unsplash.com/photo-1614294149010-950b698f72c0?q=80&w=300&h=400&fit=crop",
    banner: "https://images.unsplash.com/photo-1614294149010-950b698f72c0?q=80&w=1920&h=500&fit=crop",
    created_at: createDate(3),
    platform: ["PS5"],
  },
  {
    id: "8",
    name: "Gran Turismo 7",
    image: "https://images.unsplash.com/photo-1511919884226-fd3cad34687c?q=80&w=300&h=400&fit=crop",
    banner: "https://images.unsplash.com/photo-1511919884226-fd3cad34687c?q=80&w=1920&h=500&fit=crop",
    created_at: createDate(2),
    platform: ["PS5", "PS4"],
  },
  {
    id: "9",
    name: "Uncharted 4",
    image: "https://images.unsplash.com/photo-1553481187-be93c21490a9?q=80&w=300&h=400&fit=crop",
    banner: "https://images.unsplash.com/photo-1553481187-be93c21490a9?q=80&w=1920&h=500&fit=crop",
    created_at: createDate(40),
    platform: ["PS4", "PS5"],
  },
  {
    id: "10",
    name: "The Last of Us Part I",
    image: "https://images.unsplash.com/photo-1509198397868-475647b2a1e5?q=80&w=300&h=400&fit=crop",
    banner: "https://images.unsplash.com/photo-1509198397868-475647b2a1e5?q=80&w=1920&h=500&fit=crop",
    created_at: createDate(18),
    platform: ["PS3", "PS4", "PS5"],
  },
  {
    id: "11",
    name: "Persona 4 Golden",
    image: "https://images.unsplash.com/photo-1579373903781-fd5c0c30c4cd?q=80&w=300&h=400&fit=crop",
    banner: "https://images.unsplash.com/photo-1579373903781-fd5c0c30c4cd?q=80&w=1920&h=500&fit=crop",
    created_at: createDate(35),
    platform: ["VITA", "PC", "PS4"],
  },
  {
    id: "12",
    name: "Beat Saber",
    image: "https://images.unsplash.com/photo-1593508512255-86ab42a8e620?q=80&w=300&h=400&fit=crop",
    banner: "https://images.unsplash.com/photo-1593508512255-86ab42a8e620?q=80&w=1920&h=500&fit=crop",
    created_at: createDate(14),
    platform: ["VR", "PS5"],
  }
];

// Dados de contas
export const accounts: Account[] = [
  {
    id: "1",
    name: "Conta Principal",
    email: "psngames_principal@example.com",
    password: "senha123",
    code: "ABC123",
    qrcode: "https://images.unsplash.com/photo-1605369570554-353195d1b964?q=80&w=200&h=200&fit=crop",
    created_at: createDate(20),
    birthday: createDate(1000),
    response: "Nome do primeiro animal de estimação",
    games: [games[0], games[1], games[2]],
    slot1: undefined,
    slot2: undefined,
  },
  {
    id: "2",
    name: "Conta Jogos Exclusivos",
    email: "psngames_exclusivos@example.com",
    password: "senha456",
    code: "DEF456",
    qrcode: "https://images.unsplash.com/photo-1605369570554-353195d1b964?q=80&w=200&h=200&fit=crop",
    created_at: createDate(18),
    birthday: createDate(1100),
    response: "Cidade natal",
    games: [games[3], games[4], games[5]],
    slot1: undefined,
    slot2: undefined,
  },
  {
    id: "3",
    name: "Conta Multiplayer",
    email: "psngames_multi@example.com",
    password: "senha789",
    code: "GHI789",
    qrcode: "https://images.unsplash.com/photo-1605369570554-353195d1b964?q=80&w=200&h=200&fit=crop",
    created_at: createDate(15),
    birthday: createDate(1200),
    response: "Nome da mãe",
    games: [games[6], games[7], games[8], games[9]],
    slot1: undefined,
    slot2: undefined,
  },
  {
    id: "4",
    name: "Conta Indie Games",
    email: "psngames_indie@example.com",
    password: "senhaABC",
    code: "JKL012",
    qrcode: "https://images.unsplash.com/photo-1605369570554-353195d1b964?q=80&w=200&h=200&fit=crop",
    created_at: createDate(12),
    birthday: createDate(1300),
    response: "Primeiro carro",
    games: [games[0], games[7], games[10]],
    slot1: undefined,
    slot2: undefined,
  },
  {
    id: "5",
    name: "Conta RPG",
    email: "psngames_rpg@example.com",
    password: "senhaDEF",
    code: "MNO345",
    qrcode: "https://images.unsplash.com/photo-1605369570554-353195d1b964?q=80&w=200&h=200&fit=crop",
    created_at: createDate(10),
    birthday: createDate(1400),
    response: "Filme favorito",
    games: [games[2], games[3], games[4], games[11]],
    slot1: undefined,
    slot2: undefined,
  },
  {
    id: "6",
    name: "Conta Aventura",
    email: "psngames_aventura@example.com",
    password: "senhaGHI",
    code: "PQR678",
    qrcode: "https://images.unsplash.com/photo-1605369570554-353195d1b964?q=80&w=200&h=200&fit=crop",
    created_at: createDate(5),
    birthday: createDate(1500),
    response: "Banda favorita",
    games: [games[1], games[5], games[6], games[9], games[10]],
    slot1: undefined,
    slot2: undefined,
  }
];

// Dados de membros
export const members: Member[] = [
  {
    id: "1",
    name: "João Silva",
    email: "joao@example.com",
    password: "senha123",
    psn_id: "joaosilva_psn",
    profile_image: "https://images.unsplash.com/photo-1599566150163-29194dcaad36?q=80&w=100&h=100&fit=crop",
    created_at: createDate(30),
    isApproved: true,
    payments: [
      {
        id: "p1",
        member_id: "1",
        month: new Date().getMonth(),
        year: new Date().getFullYear(),
        amount: 30.0,
        paid_at: createDate(5),
        status: "paid",
      },
    ],
  },
  {
    id: "2",
    name: "Maria Oliveira",
    email: "maria@example.com",
    password: "senha456",
    psn_id: "maria_oliveira",
    profile_image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=100&h=100&fit=crop",
    created_at: createDate(25),
    isApproved: true,
    payments: [
      {
        id: "p2",
        member_id: "2",
        month: new Date().getMonth(),
        year: new Date().getFullYear(),
        amount: 30.0,
        paid_at: createDate(3),
        status: "paid",
      },
    ],
  },
  {
    id: "3",
    name: "Pedro Santos",
    email: "pedro@example.com",
    password: "senha789",
    psn_id: "pedro_santos",
    profile_image: "https://images.unsplash.com/photo-1633332755192-727a05c4013d?q=80&w=100&h=100&fit=crop",
    created_at: createDate(20),
    isApproved: true,
    payments: [
      {
        id: "p3",
        member_id: "3",
        month: new Date().getMonth(),
        year: new Date().getFullYear(),
        amount: 30.0,
        paid_at: createDate(2),
        status: "paid",
      },
    ],
  },
  {
    id: "4",
    name: "Ana Costa",
    email: "ana@example.com",
    password: "senhaABC",
    psn_id: "ana_costa",
    profile_image: "https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=100&h=100&fit=crop",
    created_at: createDate(15),
    isApproved: true,
    payments: [
      {
        id: "p4",
        member_id: "4",
        month: new Date().getMonth(),
        year: new Date().getFullYear(),
        amount: 30.0,
        paid_at: createDate(1),
        status: "paid",
      },
    ],
  },
  {
    id: "5",
    name: "Lucas Ferreira",
    email: "lucas@example.com",
    password: "senhaDEF",
    psn_id: "lucas_ferreira",
    profile_image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=100&h=100&fit=crop",
    created_at: createDate(10),
    isApproved: false,
    payments: [],
  },
  {
    id: "6",
    name: "Juliana Rocha",
    email: "juliana@example.com",
    password: "senhaGHI",
    psn_id: "juliana_rocha",
    profile_image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=100&h=100&fit=crop",
    created_at: createDate(5),
    isApproved: false,
    payments: [],
  }
];

// Configurando o uso de slots para alguns membros e conectando membros às contas
const now = new Date();
accounts[0].slot1 = {
  member: members[0],
  entered_at: new Date(now.getTime() - 1000 * 60 * 60) // 1 hora atrás
};

accounts[1].slot2 = {
  member: members[1],
  entered_at: new Date(now.getTime() - 1000 * 60 * 30) // 30 minutos atrás
};

accounts[2].slot1 = {
  member: members[2],
  entered_at: new Date(now.getTime() - 1000 * 60 * 120) // 2 horas atrás
};

accounts[3].slot1 = {
  member: members[3],
  entered_at: new Date(now.getTime() - 1000 * 60 * 45) // 45 minutos atrás
};

accounts[4].slot2 = {
  member: members[0],
  entered_at: new Date(now.getTime() - 1000 * 60 * 90) // 90 minutos atrás
};

// Users (admin e membros)
export const users: User[] = [
  {
    id: "admin1",
    name: "Administrador",
    email: "admin@example.com",
    role: "admin",
  },
  {
    id: members[0].id,
    name: members[0].name,
    email: members[0].email,
    role: "member",
    member: members[0],
  },
  {
    id: members[1].id,
    name: members[1].name,
    email: members[1].email,
    role: "member",
    member: members[1],
  },
  {
    id: members[2].id,
    name: members[2].name,
    email: members[2].email,
    role: "member",
    member: members[2],
  },
];

// Function para obter jogos recentes
export const getRecentGames = (limit = 6): Game[] => {
  return [...games]
    .sort((a, b) => b.created_at.getTime() - a.created_at.getTime())
    .slice(0, limit);
};

// Function para obter contas recentes
export const getRecentAccounts = (limit = 6): Account[] => {
  return [...accounts]
    .sort((a, b) => b.created_at.getTime() - a.created_at.getTime())
    .slice(0, limit);
};

