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
  insert: (game: Platform) => Promise<number>;
  update: (game: Platform) => Promise<void>;
  remove: (id: number) => Promise<void>;
}
