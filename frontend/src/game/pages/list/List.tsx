import React, { ChangeEvent, FormEvent, useEffect, useState } from 'react';
import { useQuery } from '@apollo/react-hooks';
import { gql } from 'apollo-boost';
import { Link, useParams, useHistory } from 'react-router-dom';
import ProgressBar from '../../../common/components/loader/ProgressBar';
import logger from '../../../common/services/logger/logger';
import { Game } from '../../domain/game';
import parseDescription from './parseDescription';

export const GAME_LIST_QUERY = gql`
    query Games($name: String){
      games(name: $name, limit: 100) {
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
  let { search } = useParams();
  search = search || '';
  const history = useHistory();

  const { data, loading, error } = useQuery(GAME_LIST_QUERY, {
    fetchPolicy: search ? 'no-cache' : 'cache-first',
    variables: {
      name: search,
    },
  });

  const [searchInputValue, setSearchInputValue] = useState(search);
  useEffect(() => {
    setSearchInputValue(search || '');
  },        [search]);

  const submitSearchHandler = (event: FormEvent) => {
    event.preventDefault();
    history.push(`/game/search/${searchInputValue}`);
  };

  const changeSearchFieldHandler = (event: ChangeEvent) => {
    setSearchInputValue((event?.target as HTMLInputElement).value);
  };

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
                    to={{ pathname: `/game/${game.id}` }}
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
            <form onSubmit={submitSearchHandler}>
              <div className="field has-addons" >
                <div className="control is-expanded">
                  <input
                    placeholder="Search a game"
                    className="input"
                    type="text"
                    value={searchInputValue}
                    onChange={changeSearchFieldHandler}
                  />
                </div>
                <div className="control">
                  <button className="button is-info">Submit</button>
                </div>
              </div>
            </form>
          <br/>
          {games.length ? games : <h3 className="title is-4">No games found</h3>}
        </div>
  );
};
