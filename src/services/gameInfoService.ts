
import { Game } from '@/types';

interface RawgGame {
  id: number;
  name: string;
  background_image?: string;
  background_image_additional?: string;
  description_raw?: string;
  developers?: Array<{ name: string }>;
  genres?: Array<{ name: string }>;
  released?: string;
  platforms?: Array<{
    platform: {
      name: string;
    };
  }>;
  metacritic?: number;
  rating?: number;
}

interface TrophyInfo {
  bronze: number;
  silver: number;
  gold: number;
  platinum: number;
  total: number;
}

interface GameInfo {
  trophyInfo?: TrophyInfo;
  description?: string;
  developer?: string;
  genre?: string;
  releaseDate?: string;
}

interface MemberTrophyStats {
  platinum: number;
  gold: number;
  silver: number;
  bronze: number;
  totalTrophies: number;
  level: number;
  recentlyPlayed?: string[];
}

export const gameInfoService = {
  async searchGames(query: string): Promise<RawgGame[]> {
    try {
      const response = await fetch(`https://api.rawg.io/api/games?search=${encodeURIComponent(query)}&page_size=10`);
      const data = await response.json();
      return data.results || [];
    } catch (error) {
      console.error('Error searching games:', error);
      return [];
    }
  },

  async getGameDetails(rawgId: number): Promise<RawgGame | null> {
    try {
      const response = await fetch(`https://api.rawg.io/api/games/${rawgId}`);
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching game details:', error);
      return null;
    }
  },

  mapRawgToGame(rawgGame: RawgGame): Partial<Game> {
    const platformMap: Record<string, string> = {
      'PlayStation 5': 'PS5',
      'PlayStation 4': 'PS4',
      'PlayStation 3': 'PS3',
      'PS Vita': 'VITA',
    };

    const platforms = rawgGame.platforms?.map(p => {
      const platformName = p.platform.name;
      return platformMap[platformName] || platformName;
    }).filter(p => ['PS5', 'PS4', 'PS3', 'VITA'].includes(p)) || [];

    return {
      name: rawgGame.name,
      image: rawgGame.background_image,
      banner: rawgGame.background_image_additional || rawgGame.background_image,
      platform: platforms,
      description: rawgGame.description_raw,
      developer: rawgGame.developers?.[0]?.name,
      genre: rawgGame.genres?.[0]?.name,
      release_date: rawgGame.released,
      rawg_id: rawgGame.id,
    };
  },

  async enrichGameData(game: Partial<Game>): Promise<Partial<Game>> {
    if (!game.rawg_id) return game;

    try {
      const rawgGame = await this.getGameDetails(game.rawg_id);
      if (!rawgGame) return game;

      const enrichedData = this.mapRawgToGame(rawgGame);
      
      return {
        ...game,
        ...enrichedData,
        // Keep original data if it exists
        name: game.name || enrichedData.name,
        image: game.image || enrichedData.image,
        banner: game.banner || enrichedData.banner,
        platform: game.platform || enrichedData.platform,
        description: game.description || enrichedData.description,
        developer: game.developer || enrichedData.developer,
        genre: game.genre || enrichedData.genre,
        release_date: game.release_date || enrichedData.release_date,
      };
    } catch (error) {
      console.error('Error enriching game data:', error);
      return game;
    }
  },

  async createGameFromRawg(rawgGame: RawgGame): Promise<Partial<Game>> {
    const mappedGame = this.mapRawgToGame(rawgGame);
    
    // Ensure required fields are present
    return {
      name: mappedGame.name || 'Unknown Game',
      image: mappedGame.image,
      banner: mappedGame.banner,
      platform: mappedGame.platform || [],
      description: mappedGame.description,
      developer: mappedGame.developer,
      genre: mappedGame.genre,
      release_date: mappedGame.release_date,
      rawg_id: mappedGame.rawg_id,
    };
  }
};

// Mock implementation for fetchGameInfo
export const fetchGameInfo = async (game: Game): Promise<GameInfo> => {
  // Mock trophy data
  const mockTrophyInfo: TrophyInfo = {
    bronze: Math.floor(Math.random() * 50) + 10,
    silver: Math.floor(Math.random() * 20) + 5,
    gold: Math.floor(Math.random() * 10) + 2,
    platinum: Math.random() > 0.3 ? 1 : 0,
    total: 0
  };
  
  mockTrophyInfo.total = mockTrophyInfo.bronze + mockTrophyInfo.silver + mockTrophyInfo.gold + mockTrophyInfo.platinum;

  return {
    trophyInfo: mockTrophyInfo,
    description: game.description || `This is an exclusive game available in our sharing system.`,
    developer: game.developer,
    genre: game.genre,
    releaseDate: game.release_date
  };
};

// Mock implementation for fetchMemberTrophyStats
export const fetchMemberTrophyStats = async (psnId: string): Promise<MemberTrophyStats> => {
  // Mock data based on PSN ID
  return {
    platinum: Math.floor(Math.random() * 50) + 10,
    gold: Math.floor(Math.random() * 200) + 50,
    silver: Math.floor(Math.random() * 500) + 100,
    bronze: Math.floor(Math.random() * 1000) + 200,
    totalTrophies: 0,
    level: Math.floor(Math.random() * 500) + 100,
    recentlyPlayed: [
      'God of War',
      'Spider-Man',
      'The Last of Us Part II',
      'Ghost of Tsushima'
    ].slice(0, Math.floor(Math.random() * 4) + 1)
  };
};
