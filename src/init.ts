const { ApolloServer, gql } = require('apollo-server');
import { schema } from './services/common/graphql/schemaLoader';
import { gameRepository, init as initGameRepository } from './services/game/sqlite/gameRepository';
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

async function initApp() {
  const connection = await new sqlite3.Database(`${__dirname}/../data/games.sqlite`);
  initGameRepository(connection);
  initPlatformRepository(connection);

  const server = new ApolloServer({
    typeDefs: gql`${schema}`,
    resolvers: {
      Query: {
        ...gameQueryResolvers,
        ...platformQueryResolvers,
      },
      Mutation: {
        ...gameMutationResolvers,
        ...platformMutationResolvers,
      },
      ...gameFieldResolvers,
      ...platformFieldResolvers,
    },
    context: {
      gameRepository,
      platformRepository,
    },
  });

  server.listen().then(({ url }: { url: string}) => {
    console.log(`🚀Server ready at ${url}`);
  });
}

initApp();
