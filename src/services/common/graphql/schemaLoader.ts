import { readFileSync } from 'fs';
import { gql } from 'apollo-server';

export const schema = gql`
${readFileSync(`${__dirname}/../../../../schema/base.graphql`).toString()}
${readFileSync(`${__dirname}/../../../../schema/game.graphql`).toString()}
${readFileSync(`${__dirname}/../../../../schema/platform.graphql`).toString()}
`;
