import { Game } from '../game/game';

export interface Platform {
  id: number;
  name: string;
  description?: string;
  games: Game[];
}

export interface PlatformRepository {
  find: (id: number) => Promise<Platform>;
  findAll: () => Promise<Platform[]>;
  insert: (platform: Platform) => Promise<number>;
  update: (platform: Platform) => Promise<void>;
  remove: (id: number) => Promise<void>;
}
