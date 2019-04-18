import { readFileSync } from 'fs';
import { buildSchema } from 'graphql';
import { Game } from '../../domain/game/game';
import { find, findAll, findByName, insert, remove, update } from '../sqlite/gamesRepository';

export const schema = buildSchema(
  readFileSync(`${__dirname}/../../../graphql/schema.graphql`).toString(),
);

export const root = {
  game: async ({ id }: { id: number }) => {
    return await find(id);
  },
  games: async ({ name }: { name: string }) => {
    if (name) {
      return await findByName(name);
    }
    return await findAll();

  },
  createGame: async (game: Game) => {
    const id: number = await insert(game);

    game.id = id;

    return game;
  },
  updateGame: async (game: Game) => {
    const storedGame: Game = await find(game.id || 0);

    if (!storedGame) {
      throw new Error('Game Not Found');
    }

    const data: Game = {
      ...storedGame,
      ...game,
    };

    await update(game);

    return data;
  },
  deleteGame: async ({ id }: { id: number }) => {
    const storedGame: Game = await find(id);

    if (!storedGame) {
      throw new Error('Game Not Found');
    }

    await remove(id);

    return storedGame;
  },
};
