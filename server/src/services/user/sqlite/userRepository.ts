import { Database } from 'sqlite3';
import { User, UserRepository } from '../../../domain/user/user';
let db: Database;

export function init(connection: Database) {
  db = connection;
}

function find(id: number): Promise<User> {
  return new Promise((resolve, reject) => {
    db.get('SELECT * from users WHERE id = ?', [id], (error, statement) => {
      if (error) {
        reject(error);
      }

      resolve(statement);
    });
  });
}

function findByApiKey(apiKey: string): Promise<User> {
  return new Promise((resolve, reject) => {
    db.get('SELECT * from users WHERE api_key = ?', [apiKey], (error, statement) => {
      if (error) {
        reject(error);
      }

      resolve(statement);
    });
  });
}

export function insert(user: User): Promise<number> {
  return new Promise((resolve, reject) => {
    db.run(
      'INSERT INTO users (username, roles, api_key) VALUES (?, ?, ?)',
      [user.username, user.roles, user.api_key],
      (error) => {
        if (error) {
          reject(error);
        }

        db.get('SELECT last_insert_rowid() as id', (error, st) => resolve(st.id));
      });
  });
}

export function update(user: User): Promise<void> {
  return new Promise((resolve, reject) => {
    db.run(
      'UPDATE users SET name = ?, roles = ? WHERE id = ?',
      [user.username, user.roles, user.id],
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
    db.run('DELETE FROM users WHERE id = ?', [id], (error) => {
      resolve();
    });
  });
}

export const userRepository: UserRepository = {
  find,
  findByApiKey,
  insert,
  update,
  remove,
};
