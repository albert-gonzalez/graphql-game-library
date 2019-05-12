import { GameRepository } from '../game/game';
import { PlatformRepository } from '../platform/platform';
import { User, UserRepository } from '../user/user';

export interface Context {
  user: User;
  gameRepository: GameRepository;
  platformRepository: PlatformRepository;
  userRepository: UserRepository;
}
