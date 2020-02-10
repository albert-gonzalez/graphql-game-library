import { ApolloServer } from 'apollo-server';
import { schema } from '../../../src/services/common/graphql/schemaLoader';
import { exampleGame, gameRepository } from '../../services/game/inMemory/inMemoryGameRepository';
import {
  anotherExamplePlatform, examplePlatform,
  initPlatformRepository,
  platformRepository,
} from '../../services/platform/inMemory/inMemoryPlatformRepository';
import {
  platformFieldResolvers,
  platformMutationResolvers,
  platformQueryResolvers,
} from '../../../src/domain/platform/resolvers';
import { Platform } from '../../../src/domain/platform/platform';
const { createTestClient } = require('apollo-server-testing');

describe('Platform Resolvers', () => {
  let query: any;
  let mutate: any;

  beforeAll(() => {
    const server = new ApolloServer({
      typeDefs: schema,
      resolvers: {
        Query: platformQueryResolvers,
        Mutation: platformMutationResolvers,
        ...platformFieldResolvers,
      },
      context: () => ({ gameRepository, platformRepository }),
    });

    ({ query, mutate } = createTestClient(server));
  });

  beforeEach(() => {
    initPlatformRepository();
  });

  describe('Queries', () => {
    test('platform query should return a platform', async () => {
      const res = await query({
        query: `{
        platform(id: 2) {
          id
          name
          description
          games {
            id
            name
          }
        }
      }`,
      });

      expect(res.data.platform.id).toBe(anotherExamplePlatform.id);
      expect(res.data.platform.name).toBe(anotherExamplePlatform.name);
      expect(res.data.platform.games[0].id).toBe(exampleGame.id);
      expect(res.data.platform.games[0].name).toBe(exampleGame.name);
    });

    test('platform query should throw an exception if platform does not exist', async () => {
      const res = await query({
        query: `{
        platform(id: 4) {
          id
          name
          description
          games {
            id
            name
          }
        }
      }`,
      });

      expect(res.errors[0].message).toBe('Platform Not Found');
    });

    test('platforms query should return a list of platforms', async () => {
      const res = await query({
        query: `{
        platforms {
          id
          name
          description
        }
      }`,
      });

      expect(res.data.platforms).toHaveLength(2);
      expect(res.data.platforms[0].id).toBe(examplePlatform.id);
      expect(res.data.platforms[0].name).toBe(examplePlatform.name);
    });
  });

  describe('Mutations', () => {
    test('createPlatform should add a platform and return it', async () => {
      const res = await mutate({
        mutation: `mutation ($input: CreatePlatformInput!){
            createPlatform(input: $input) {
              id
              name
              description
            }
          }`,
        variables: {
          input: {
            name: 'Some name',
            description: 'desc',
          },
        },
      });

      expect(res.data.createPlatform.id).toBe(3);
      expect(res.data.createPlatform.name).toBe('Some name');

      expect(await platformRepository.find(res.data.createPlatform.id)).toBeDefined();
    });

    test('updatePlatform should update a platform and return it', async () => {
      const res = await mutate({
        mutation: `mutation ($id: Int!, $input: UpdatePlatformInput!){
            updatePlatform(id: $id, input: $input) {
              id
              name
              description
            }
          }`,
        variables: {
          id: 1,
          input: {
            name: 'Some name',
            description: 'desc',
          },
        },
      });

      expect(res.data.updatePlatform.id).toBe(1);
      expect(res.data.updatePlatform.name).toBe('Some name');

      const platform: Platform = await platformRepository.find(res.data.updatePlatform.id);
      expect(platform.name).toBe('Some name');
    });

    test('updatePlatform should throw an exception if platform does not exist', async () => {
      const res = await mutate({
        mutation: `mutation ($id: Int!, $input: UpdatePlatformInput!){
            updatePlatform(id: $id, input: $input) {
              id
              name
              description
            }
          }`,
        variables: {
          id: 4,
          input: {
            name: 'Some name',
            description: 'desc',
          },
        },
      });

      expect(res.errors[0].message).toBe('Platform Not Found');
    });

    test('deletePlatform should delete a platform and return it', async () => {
      const res = await mutate({
        mutation: `mutation ($id: Int!){
            deletePlatform(id: $id) {
              id
              name
              description
            }
          }`,
        variables: {
          id: 1,
        },
      });

      expect(res.data.deletePlatform.id).toBe(1);

      const platform: Platform = await platformRepository.find(res.data.deletePlatform.id);
      expect(platform).toBeUndefined();
    });

    test('deletePlatform should throw an exception if game does not exist', async () => {
      const res = await mutate({
        mutation: `mutation ($id: Int!){
            deletePlatform(id: $id) {
              id
              name
              description
            }
          }`,
        variables: {
          id: 4,
        },
      });

      expect(res.errors[0].message).toBe('Platform Not Found');
    });
  });
});
