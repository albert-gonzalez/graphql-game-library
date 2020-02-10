import { Platform } from './platform';
import { Game } from '../game/game';
import { Context } from '../common/context';
import { ApolloError } from 'apollo-server';

export const platformQueryResolvers = {
  platform: async (_: any, { id }: { id: number }, context: Context) => {
    const platform = await context.platformRepository.find(id);

    if (!platform) {
      throw new ApolloError('Platform Not Found', '404');
    }

    return platform;
  },
  platforms: async (_: any, __: any, context: Context) => {
    return await context.platformRepository.findAll();
  },
};

export const platformMutationResolvers = {
  createPlatform: async (
    _: any,
    { input }: { input: Platform },
    context: Context,
  ): Promise<Platform> => {

    const id: number = await context.platformRepository.insert(input);
    const platform: Platform = { ...input };

    platform.id = id;

    return platform;
  },
  updatePlatform: async (
    _: any,
    { id, input }: {id: number, input: Platform },
    context: Context,
  ): Promise<Platform> => {
    const storedPlatform: Platform = await context.platformRepository.find(id || 0);

    if (!storedPlatform) {
      throw new ApolloError('Platform Not Found', '404');
    }

    const platform: Platform = {
      ...storedPlatform,
      ...input,
    };

    await context.platformRepository.update(platform);

    return platform;
  },
  deletePlatform: async (_: any, { id }: { id: number }, context: Context): Promise<Platform> => {
    const storedPlatform: Platform = await context.platformRepository.find(id);

    if (!storedPlatform) {
      throw new ApolloError('Platform Not Found', '404');
    }

    await context.platformRepository.remove(id);

    return storedPlatform;
  },
};

export const platformFieldResolvers = {
  Platform: {
    async games(platform: Platform, args: any, context: Context): Promise<Game[]> {
      const games = await
        context.gameRepository.findByPlatformId(platform.id);

      return games
        .map(game => ({ ...game, platform: { ...platform } }));
    },
  },
};
