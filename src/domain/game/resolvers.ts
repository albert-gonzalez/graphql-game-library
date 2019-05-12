import { Game } from './game';
import { Context } from '../common/context';
import { Platform } from '../platform/platform';

export const gameQueryResolvers = {
  game: async (_: any, { id }: { id: number }, context: Context): Promise<Game> => {
    return await context.gameRepository.find(id);
  },
  games: async (_: any, { name }: { name: string }, context: Context): Promise<Game[]> => {
    if (name) {
      return await context.gameRepository.findByName(name);
    }
    return await context.gameRepository.findAll();

  },
};

export const gameMutationResolvers = {
  createGame: async (_: any, { input }: { input: Game }, context: Context): Promise<Game> => {
    const id: number = await context.gameRepository.insert(input);
    const game: Game = { ...input };

    game.id = id;

    return game;
  },
  updateGame: async (
    _: any,
    { id, input }: {id: number, input: Game},
    context: Context,
  ): Promise<Game> => {
    const storedGame: Game = await context.gameRepository.find(id || 0);

    if (!storedGame) {
      throw new Error('Game Not Found');
    }

    const game: Game = {
      ...storedGame,
      ...input,
    };

    await context.gameRepository.update(game);

    return game;
  },
  deleteGame: async (_: any, { id }: { id: number }, context: Context): Promise<Game> => {
    const storedGame: Game = await context.gameRepository.find(id);

    if (!storedGame) {
      throw new Error('Game Not Found');
    }

    await context.gameRepository.remove(id);

    return storedGame;
  },
};

export const gameFieldResolvers = {
  Game: {
    async platform(game: Game, args: any, context: Context): Promise<Platform> {
      if (game.platform) {
        return game.platform;
      }

      return await context.platformRepository.find(game.platform_id);
    },
  },
};
