import express from 'express';
import expressGraphql from 'express-graphql';
import { root, schema } from './services/graphql/schemaCreator';
import { init as initDB } from './services/sqlite/gamesRepository';

const app = express();

async function initApp() {
  await initDB();

  app.use('/graphql', expressGraphql({
    schema,
    graphiql: true,
    rootValue: root,
  }));

  app.listen(4000);
}

initApp();
