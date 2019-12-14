import React from 'react';
import { useQuery } from '@apollo/react-hooks';
import { gql } from 'apollo-boost';
import { Link } from 'react-router-dom';
import ProgressBar from '../../../common/components/loader/ProgressBar';
import logger from '../../../common/services/logger/logger';
import { Game } from '../../domain/game';
import parseDescription from './parseDescription';

export const GAME_LIST_QUERY = gql`
    {
      games {
        id
        name
        description
        url
        platform {
          id
          name
        }
      }
    }
`;

export default () => {
  const { data, loading, error } = useQuery(GAME_LIST_QUERY);

  if (loading) {
    return <ProgressBar />;
  }

  if (error) {
    logger.warn(error);
    return (<div className="section"><h2 className="title">Error loading the game list</h2></div>);
  }

  const games = data.games.map((game: Partial<Game>) => {
    const description = {
      __html: parseDescription(game),
    };
    return (
            <div className="box" key={game.id}>
                <Link
                    className="has-text-black"
                    to={{ pathname: `game/${game.id}` }}
                >
                        <h2 className="title is-4">{game.name}</h2>
                        <h3 className="subtitle is-4">{game?.platform?.name}</h3>
                        <div dangerouslySetInnerHTML={description}/>
                </Link>
            </div>

    );
  });

  return (
        <div className="section">
            <h2 className="title is-3">List of games</h2>
            {games}
        </div>
  );
};
