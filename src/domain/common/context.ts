import { GameRepository } from '../game/game';
import { PlatformRepository } from '../platform/platform';

export interface Context {
  gameRepository: GameRepository;
  platformRepository: PlatformRepository;
}
