import { Platform } from '../../platform/domain/platform';

export interface Game {
  id: number;
  name: string;
  description?: string;
  url?: string;
  platform: Platform;
}
