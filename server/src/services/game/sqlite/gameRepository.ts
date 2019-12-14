import { Database } from 'sqlite3';
import { Game, GameRepository } from '../../../domain/game/game';
let db: Database;

export function init(connection: Database) {
  db = connection;
}

export function find(id: number): Promise<Game> {
  return new Promise((resolve, reject) => {
    db.get('SELECT * from games WHERE  id = ?', [id], (error, statement) => {
      if (error) {
        reject(error);
      }

      resolve(statement);
    });
  });
}

export function findAll(): Promise<Game[]> {
  return new Promise((resolve, reject) => {
    db.all('SELECT * from games', [], (error, statement) => {
      if (error) {
        reject(error);
      }

      resolve(statement);
    });
  });
}

export function findByName(name: string): Promise<Game[]> {
  return new Promise((resolve, reject) => {
    db.all('SELECT * from games WHERE name like ?', [`${name}%`], (error, statement) => {
      if (error) {
        reject(error);
      }

      resolve(statement);
    });
  });
}

export function findByPlatformId(platformId: number): Promise<Game[]> {
  return new Promise((resolve, reject) => {
    db.all('SELECT * from games WHERE platform_id = ?', [platformId], (error, statement) => {
      if (error) {
        reject(error);
      }

      resolve(statement);
    });
  });
}

export function insert(game: Game): Promise<number> {
  return new Promise((resolve, reject) => {
    db.run(
      'INSERT INTO games (name, description, url, platform_id) VALUES (?, ?, ?, ?)',
      [game.name, game.description, game.url, game.platform_id],
      (error) => {
        if (error) {
          reject(error);
        }

        db.get('SELECT last_insert_rowid() as id', (error, st) => resolve(st.id));
      });
  });
}

export function update(game: Game): Promise<void> {
  return new Promise((resolve, reject) => {
    db.run(
      'UPDATE games SET name = ?, description = ?, url = ?, platform_id = ? WHERE id = ?',
      [game.name, game.description, game.url, game.id, game.platform_id],
      (error) => {
        if (error) {
          reject(error);
        }

        resolve();
      });
  });
}

export function remove(id: number): Promise<void> {
  return new Promise((resolve) => {
    db.run('DELETE FROM games WHERE id = ?', [id], (error) => {
      resolve();
    });
  });
}

export const gameRepository: GameRepository = {
  find,
  findAll,
  findByName,
  findByPlatformId,
  insert,
  update,
  remove,
};
