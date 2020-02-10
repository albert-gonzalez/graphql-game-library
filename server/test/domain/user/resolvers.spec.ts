import { ApolloServer } from 'apollo-server';
import { schema } from '../../../src/services/common/graphql/schemaLoader';
import { ADMIN_ROLE, User, USER_ROLE } from '../../../src/domain/user/user';
import { exampleAdmin, initUserRepository, userRepository } from '../../services/user/inMemory/inMemoryUserRepository';
import { userMutationResolvers } from '../../../src/domain/user/resolvers';
import { createTestClient } from 'apollo-server-testing';

const CREATE_USER_MUTATION = `
  mutation ($input: UserInput!){
    createUser(input: $input) {
      id
      username
      roles
      api_key
    }
  }`;

const UPDATE_USER_MUTATION = `
  mutation ($id: Int!, $input: UserInput!){
    updateUser(id: $id, input: $input) {
      id
      username
      roles
    }
  }`;

const DELETE_USER_MUTATION = `
  mutation ($id: Int!){
    deleteUser(id: $id) {
      id
      username
      roles
    }
  }`;

describe('User Resolvers', () => {
  let query: any;
  let mutate: any;
  const loggedUser: User = {
    ...exampleAdmin,
  };

  beforeAll(() => {
    const server = new ApolloServer({
      typeDefs: schema,
      resolvers: {
        Mutation: userMutationResolvers,
      },
      context: () => ({
        userRepository,
        user: loggedUser,
      }),
    });

    ({ query, mutate } = createTestClient(server));
  });

  beforeEach(() => {
    loggedUser.roles = ADMIN_ROLE;
    initUserRepository();
  });

  describe('Mutations', () => {
    test('createUser should add a user and return it', async () => {
      const res = await mutate({
        mutation: CREATE_USER_MUTATION,
        variables: {
          input: {
            username: 'Some name',
            roles: USER_ROLE,
          },
        },
      });

      expect(res.data.createUser.id).toBe(3);
      expect(res.data.createUser.username).toBe('Some name');
      expect(typeof res.data.createUser.api_key).toBe('string');

      expect(await userRepository.find(res.data.createUser.id)).toBeDefined();
    });

    test('createUser should throw an error if logged user is not admin', async () => {
      loggedUser.roles = USER_ROLE;

      const res = await mutate({
        mutation: CREATE_USER_MUTATION,
        variables: {
          input: {
            username: 'Some name',
            roles: USER_ROLE,
          },
        },
      });

      expect(res.errors[0].extensions.code).toBe('UNAUTHENTICATED');
    });

    test('updateUser should update a user and return it', async () => {

      const res = await mutate({
        mutation: UPDATE_USER_MUTATION,
        variables: {
          id: 1,
          input: {
            username: 'Some name',
            roles: ADMIN_ROLE,
          },
        },
      });

      expect(res.data.updateUser.id).toBe(1);
      expect(res.data.updateUser.username).toBe('Some name');

      const user: User = await userRepository.find(res.data.updateUser.id);
      expect(user.username).toBe('Some name');
    });

    test('updateUser should throw an error if logged user is not admin', async () => {
      loggedUser.roles = USER_ROLE;

      const res = await mutate({
        mutation: UPDATE_USER_MUTATION,
        variables: {
          id: 1,
          input: {
            username: 'Some name',
            roles: ADMIN_ROLE,
          },
        },
      });

      expect(res.errors[0].extensions.code).toBe('UNAUTHENTICATED');
    });

    test('deleteUser should delete a user and return it', async () => {
      const res = await mutate({
        mutation: DELETE_USER_MUTATION,
        variables: {
          id: 1,
        },
      });

      expect(res.data.deleteUser.id).toBe(1);

      const user: User = await userRepository.find(res.data.deleteUser.id);
      expect(user).toBeUndefined();
    });

    test('deleteUser should throw an error if logged user is not admin', async () => {
      loggedUser.roles = USER_ROLE;

      const res = await mutate({
        mutation: DELETE_USER_MUTATION,
        variables: {
          id: 1,
        },
      });

      expect(res.errors[0].extensions.code).toBe('UNAUTHENTICATED');
    });
  });
});
