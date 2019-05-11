import { Platform } from '../platform/platform';

export interface Game {
  id?: number;
  name?: string;
  description?: string;
  url?: string;
  platform_id: number;
  platform?: Platform;
}

export interface GameRepository {
  find: (id: number) => Promise<Game>;
  findAll: () => Promise<Game[]>;
  findByName: (name: string) => Promise<Game[]>;
  findByPlatformId: (platformId: number) => Promise<Game[]>;
  insert: (game: Game) => Promise<number>;
  update: (game: Game) => Promise<void>;
  remove: (id: number) => Promise<void>;
}
