import { Context } from '../common/context';
import { checkUserIsAdmin, User } from './user';
import cryptoRandomString from 'crypto-random-string';
import { ApolloError } from 'apollo-server';

export const userMutationResolvers = {
  createUser: async (
    _: any,
    { input }: { input: User },
    context: Context,
  ): Promise<User> => {
    checkUserIsAdmin(context.user);

    const apiKey = cryptoRandomString({ length: 40, type: 'base64' });
    const user: User = { ...input, api_key: apiKey };
    const id: number = await context.userRepository.insert(user);

    user.id = id;

    return user;
  },
  updateUser: async (
    _: any,
    { id, input }: {id: number, input: User },
    context: Context,
  ): Promise<User> => {
    checkUserIsAdmin(context.user);

    const storedUser: User = await context.userRepository.find(id || 0);

    if (!storedUser) {
      throw new ApolloError('User Not Found', '404');
    }

    const user: User = {
      ...storedUser,
      ...input,
    };

    await context.userRepository.update(user);

    return user;
  },
  deleteUser: async (_: any, { id }: { id: number }, context: Context): Promise<User> => {
    checkUserIsAdmin(context.user);

    const storedUser: User = await context.userRepository.find(id);

    if (!storedUser) {
      throw new ApolloError('User Not Found', '404');
    }

    await context.userRepository.remove(id);

    return storedUser;
  },
};
