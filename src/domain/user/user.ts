import { AuthenticationError } from 'apollo-server';

export const ADMIN_ROLE = 'admin';
export const USER_ROLE = 'user';

export interface User {
  id: number;
  username: string;
  roles: string;
  api_key: string;
}

export interface UserRepository {
  find: (id: number) => Promise<User>;
  findByApiKey: (apiKey: string) => Promise<User>;
  insert: (user: User) => Promise<number>;
  update: (user: User) => Promise<void>;
  remove: (id: number) => Promise<void>;
}

export function hasRole(user: User, role: string) {
  return user.roles.includes(role);
}

export function checkUserIsAdmin(user: User) {
  if (!hasRole(user, ADMIN_ROLE)) {
    throw new AuthenticationError('User does not have permissions');
  }
}
