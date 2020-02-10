import { Game } from './game';
import { Context } from '../common/context';
import { Platform } from '../platform/platform';
import { ApolloError } from 'apollo-server';

export const gameQueryResolvers = {
  game: async (_: any, { id }: { id: number }, context: Context): Promise<Game> => {
    const game = await context.gameRepository.find(id);

    if (!game) {
      throw new ApolloError('Game Not Found', '404');
    }

    return game;
  },
  games: async (_: any, { name, limit }: { name: string, limit?: number }, context: Context): Promise<Game[]> => {
    if (name) {
      return await context.gameRepository.findByName(name);
    }
    return await context.gameRepository.findAll([limit]);

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
      throw new ApolloError('Game Not Found', '404');
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
      throw new ApolloError('Game Not Found', '404');
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
