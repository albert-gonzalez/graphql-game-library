import { Game } from '../../game/domain/game';

export interface Platform {
  id: number;
  name: string;
  description?: string;
  games: Game[];
}
