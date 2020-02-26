import React from 'react';
import { useQuery } from '@apollo/react-hooks';
import { gql } from 'apollo-boost';
import { Link, useParams } from 'react-router-dom';
import logger from '../../../common/services/logger/logger';
import { Game } from '../../domain/game';
import { replaceRelativeAnchorUrls } from '../../../common/services/url/relativeUrls';
import ProgressBar from '../../../common/components/loader/ProgressBar';

export const GAME_QUERY = '';

export default () => {
  const { id } = useParams();

  if (!id) {
    return (<div className="Section">Id needed</div>);
  }

  // Change this to useQuery
  // This query needs the "variables" option with the "id" parameter.
  // Pass the value of the "id" variable
  const { data, loading, error } = {
    data: {
      game: {},
    },
    loading: true,
    error: '',
  };

  if (loading) {
    return <ProgressBar />;
  }

  if (error) {
    logger.warn(error);
    return (<div className="section"><h2 className="title">404 - Not Found</h2></div>);
  }

  const game: Partial<Game> = data.game;

  const description = {
    __html:
      replaceRelativeAnchorUrls('giantbomb.com', game.description),
  };
  return (
        <div className="section show">
            <div className="box" key={game.id}>
                <h2 className="title is-4">{game.name}</h2>
                <h3 className="subtitle is-4">{game?.platform?.name}</h3>
                <div className="columns is-mobile">
                    <div className="column is-three-fifths">
                        <p dangerouslySetInnerHTML={description}/>
                        <br />
                        <p>
                          <a className="is-size-4" href={game.url}>Go to Giant Bomb page</a>
                        </p>
                    </div>
                    <div className="column">
                        <figure className="image is-3by4">
                            <img src="http://lorempixel.com/300/500/cats" alt={game.name}/>
                        </figure>
                    </div>
                </div>
            </div>
            <Link to="/" className="is-size-5">Back to List</Link>
        </div>
  );
};
