import {
  userRepository,
  init as initUserRepository,
} from './services/user/sqlite/userRepository';
import { ApolloServer, gql, AuthenticationError } from 'apollo-server';
import { schema } from './services/common/graphql/schemaLoader';
import {
  gameRepository,
  init as initGameRepository,
} from './services/game/sqlite/gameRepository';
import {
  platformRepository,
  init as initPlatformRepository,
} from './services/platform/sqlite/platformRepository';
import {
  gameFieldResolvers,
  gameMutationResolvers,
  gameQueryResolvers,
} from './domain/game/resolvers';
import sqlite3 from 'sqlite3';
import {
  platformFieldResolvers,
  platformMutationResolvers,
  platformQueryResolvers,
} from './domain/platform/resolvers';
import { userMutationResolvers } from './domain/user/resolvers';

async function initApp() {
  const connection = await new sqlite3.Database(`${__dirname}/../data/games.sqlite`);
  initGameRepository(connection);
  initPlatformRepository(connection);
  initUserRepository(connection);

  const server = new ApolloServer({
    typeDefs: schema,
    resolvers: {
      Query: {
        ...gameQueryResolvers,
        ...platformQueryResolvers,
      },
      Mutation: {
        ...gameMutationResolvers,
        ...platformMutationResolvers,
        ...userMutationResolvers,
      },
      ...gameFieldResolvers,
      ...platformFieldResolvers,
    },
    context: async ({ req }) => {
      const user = await userRepository.findByApiKey(req.headers.apikey as string);

      if (!user) {
        throw new AuthenticationError('User not found');
      }

      return {
        user,
        gameRepository,
        platformRepository,
        userRepository,
      };
    },
  });

  server.listen().then(({ url }: { url: string}) => {
    console.log(`🚀Server ready at ${url}`);
  });
}

initApp();
