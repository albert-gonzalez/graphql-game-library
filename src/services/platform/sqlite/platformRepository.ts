import { Database } from 'sqlite3';
import { Platform, PlatformRepository } from '../../../domain/platform/platform';
let db: Database;

export function init(connection: Database) {
  db = connection;
}

export function find(id: number): Promise<Platform> {
  return new Promise((resolve, reject) => {
    db.get('SELECT * from platforms WHERE id = ?', [id], (error, statement) => {
      if (error) {
        reject(error);
      }

      resolve(statement);
    });
  });
}

export function findAll(): Promise<Platform[]> {
  return new Promise((resolve, reject) => {
    db.all('SELECT * from platforms', [], (error, statement) => {
      if (error) {
        reject(error);
      }

      resolve(statement);
    });
  });
}

export function insert(platform: Platform): Promise<number> {
  return new Promise((resolve, reject) => {
    db.run(
      'INSERT INTO platforms (name, description) VALUES (?, ?)',
      [platform.name, platform.description],
      (error) => {
        if (error) {
          reject(error);
        }

        db.get('SELECT last_insert_rowid() as id', (error, st) => resolve(st.id));
      });
  });
}

export function update(platform: Platform): Promise<void> {
  return new Promise((resolve, reject) => {
    db.run(
      'UPDATE platforms SET name = ?, description = ? WHERE id = ?',
      [platform.name, platform.description, platform.id],
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
    db.run('DELETE FROM platforms WHERE id = ?', [id], (error) => {
      resolve();
    });
  });
}

export const platformRepository: PlatformRepository = {
  find,
  findAll,
  insert,
  update,
  remove,
};
