
import { Game } from '@/types';

interface TrophyInfo {
  bronze: number;
  silver: number;
  gold: number;
  platinum: number;
  total: number;
}

interface GameExtendedInfo {
  trophyInfo?: TrophyInfo;
  description?: string;
  releaseDate?: string;
  developer?: string;
  genre?: string;
  referenceLink?: string;
}

/**
 * Busca informações detalhadas de um jogo no Exophase e PSNProfiles
 * @param game O objeto do jogo para o qual buscar informações
 * @returns Promise com as informações estendidas do jogo
 */
export const fetchGameInfo = async (game: Game): Promise<GameExtendedInfo> => {
  try {
    console.log(`Buscando informações para o jogo: ${game.name}`);
    
    // Em um ambiente real, aqui fariam as chamadas para as APIs do Exophase e PSNProfiles
    // ou realizariam web scraping com base no referenceLink
    let referenceUrl = game.referenceLink;
    
    // Simulando o tempo de uma requisição real
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Simulando os dados retornados com base no referenceLink (mais consistentes)
    const trophyInfo: TrophyInfo = {
      bronze: Math.floor(Math.random() * 20) + 10,
      silver: Math.floor(Math.random() * 15) + 5,
      gold: Math.floor(Math.random() * 8) + 1,
      platinum: game.name.length % 2 === 0 ? 1 : 0, // Torna mais consistente
      total: 0 // Vamos calcular abaixo
    };
    
    // Calcular total de troféus
    trophyInfo.total = trophyInfo.bronze + trophyInfo.silver + trophyInfo.gold + trophyInfo.platinum;
    
    // Gerar outros dados ficcionais com base no nome do jogo e referenceLink
    const gameInfo: GameExtendedInfo = {
      trophyInfo,
      description: `${game.name} é um exclusivo para PlayStation com uma história envolvente e jogabilidade inovadora.`,
      releaseDate: new Date(Date.now() - Math.random() * 31536000000).toISOString().split('T')[0],
      developer: ['Sony Interactive', 'Naughty Dog', 'Santa Monica Studio', 'Insomniac Games'][Math.floor(Math.random() * 4)],
      genre: ['Ação', 'Aventura', 'RPG', 'Esporte', 'Corrida'][Math.floor(Math.random() * 5)],
      referenceLink: referenceUrl
    };
    
    console.log(`Informações obtidas com sucesso para: ${game.name}`, gameInfo);
    return gameInfo;
    
  } catch (error) {
    console.error(`Erro ao buscar informações do jogo ${game.name}:`, error);
    throw new Error(`Falha ao obter informações do jogo ${game.name}`);
  }
};

/**
 * Hook para integração com componentes de criação/edição de jogos
 * Deve ser chamado quando um novo jogo for criado ou editado
 */
export const enrichGameWithExternalInfo = async (gameData: Partial<Game>): Promise<Partial<Game>> => {
  if (!gameData.name) {
    console.error('Nome do jogo é obrigatório para buscar informações externas');
    return gameData;
  }
  
  try {
    // Criamos um objeto Game temporário para passar para o fetchGameInfo
    const tempGame: Game = {
      id: 'temp-id',
      name: gameData.name,
      image: gameData.image || '',
      banner: gameData.banner || '',
      platform: gameData.platform || ['PS5'],
      created_at: new Date(),
      referenceLink: gameData.referenceLink || ''
    };
    
    // Buscar informações externas
    const extendedInfo = await fetchGameInfo(tempGame);
    
    // Retornar o jogo com as informações adicionais
    console.log('Jogo enriquecido com informações externas:', {
      ...gameData,
      // Aqui podemos incorporar as informações ao modelo Game
      description: extendedInfo.description,
      releaseDate: extendedInfo.releaseDate,
      developer: extendedInfo.developer,
      genre: extendedInfo.genre
    });
    
    return {
      ...gameData,
      description: extendedInfo.description,
      releaseDate: extendedInfo.releaseDate,
      developer: extendedInfo.developer,
      genre: extendedInfo.genre
    };
    
  } catch (error) {
    console.error('Erro ao enriquecer jogo com informações externas:', error);
    return gameData;
  }
};

/**
 * Busca informações de troféus para um membro usando sua PSN ID
 * @param psnId A PSN ID do membro
 * @returns Promise com as estatísticas de troféus do usuário
 */
export const fetchMemberTrophyStats = async (psnId: string) => {
  try {
    console.log(`Buscando estatísticas de troféus para PSN ID: ${psnId}`);
    
    // Simulando o tempo de uma requisição real
    await new Promise(resolve => setTimeout(resolve, 800));
    
    // Simulando dados de troféus de um usuário
    const stats = {
      totalTrophies: Math.floor(Math.random() * 1000) + 100,
      platinum: Math.floor(Math.random() * 30) + 1,
      gold: Math.floor(Math.random() * 100) + 20,
      silver: Math.floor(Math.random() * 300) + 50,
      bronze: Math.floor(Math.random() * 700) + 100,
      level: Math.floor(Math.random() * 500) + 100,
      recentlyPlayed: [
        "God of War Ragnarök",
        "Gran Turismo 7",
        "Horizon Forbidden West"
      ]
    };
    
    return stats;
    
  } catch (error) {
    console.error(`Erro ao buscar estatísticas de troféus para ${psnId}:`, error);
    return null;
  }
};
