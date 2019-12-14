import {ApolloServer} from "apollo-server";
import {gameFieldResolvers, gameMutationResolvers, gameQueryResolvers} from "../../../src/domain/game/resolvers";
import {schema} from "../../../src/services/common/graphql/schemaLoader";
import {exampleGame, gameRepository, initGameRepository} from "../../services/game/inMemory/inMemoryGameRepository";
import {Game} from "../../../src/domain/game/game";
import {anotherExamplePlatform, platformRepository} from "../../services/platform/inMemory/inMemoryPlatformRepository";
const { createTestClient } = require('apollo-server-testing');

describe('Game Resolvers', () => {
  let query: any;
  let mutate: any;

  beforeAll(() => {
    const server = new ApolloServer({
      typeDefs: schema,
      resolvers: {
        Query: gameQueryResolvers,
        Mutation: gameMutationResolvers,
        ...gameFieldResolvers
      },
      context: () => ({ gameRepository, platformRepository }),
    });

    ({query, mutate} = createTestClient(server));
  });

  beforeEach(() => {
    initGameRepository();
  });

  describe('Queries', () => {
    test('game query should return a game', async () => {
      const res = await query({
        query: `{
        game(id: 1) {
          id
          name
          description
          url
          platform {
            id
            name
          }
        }
      }`
      });

      expect(res.data.game.id).toBe(exampleGame.id);
      expect(res.data.game.name).toBe(exampleGame.name);
      expect(res.data.game.platform.id).toBe(anotherExamplePlatform.id);
      expect(res.data.game.platform.name).toBe(anotherExamplePlatform.name);
    });

    test('games query should return a list of games', async () => {
      const res = await query({
        query: `{
        games {
          id
          name
          description
          url
        }
      }`
      });

      expect(res.data.games).toHaveLength(2);
      expect(res.data.games[0].id).toBe(exampleGame.id);
      expect(res.data.games[0].name).toBe(exampleGame.name);
    });

    test('games query should return a list of games found by a given name', async () => {
      const res = await query({
        query: `{
        games(name: "Game 1") {
          id
          name
          description
          url
        }
      }`
      });

      expect(res.data.games).toHaveLength(1);
      expect(res.data.games[0].id).toBe(exampleGame.id);
      expect(res.data.games[0].name).toBe(exampleGame.name);
    });
  });

  describe('Mutations', () => {
    test('createGame should add a game and return it', async () => {
      const res = await mutate({
        mutation: `mutation ($input: GameInput!){
            createGame(input: $input) {
              id
              name
              description
              url
            }
          }`,
        variables: {
          input: {
            name: 'Some name',
            description: 'desc',
            url: 'some url',
            platform_id: 2
          }
        }
      });

      expect(res.data.createGame.id).toBe(3);
      expect(res.data.createGame.name).toBe('Some name');

      expect(await gameRepository.find(res.data.createGame.id)).toBeDefined();
    });

    test('updateGame should update a game and return it', async () => {
      const res = await mutate({
        mutation: `mutation ($id: Int!, $input: GameInput!){
            updateGame(id: $id, input: $input) {
              id
              name
              description
              url
            }
          }`,
        variables: {
          id: 1,
          input: {
            name: 'Some name',
            description: 'desc',
            url: 'some url',
            platform_id: 2
          }
        }
      });

      expect(res.data.updateGame.id).toBe(1);
      expect(res.data.updateGame.name).toBe('Some name');

      const game: Game = await gameRepository.find(res.data.updateGame.id);
      expect(game.name).toBe('Some name');
    });

    test('deleteGame should delete a game and return it', async () => {
      const res = await mutate({
        mutation: `mutation ($id: Int!){
            deleteGame(id: $id) {
              id
              name
              description
              url
            }
          }`,
        variables: {
          id: 1,
        }
      });

      expect(res.data.deleteGame.id).toBe(1);

      const game: Game = await gameRepository.find(res.data.deleteGame.id);
      expect(game).toBeUndefined();
    });
  });
});
