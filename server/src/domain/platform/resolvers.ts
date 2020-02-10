import { Platform } from './platform';
import { Game } from '../game/game';
import { Context } from '../common/context';

export const platformQueryResolvers = {
};

export const platformMutationResolvers = {
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
