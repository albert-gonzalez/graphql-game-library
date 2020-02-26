import React, { ChangeEvent, FormEvent, useState } from 'react';
import { useMutation } from '@apollo/react-hooks';
import { gql } from 'apollo-boost';
import { useHistory } from 'react-router-dom';
import ProgressBar from '../../../common/components/loader/ProgressBar';
import logger from '../../../common/services/logger/logger';
import { GAME_LIST_QUERY } from '../list/List';

export const GAME_CREATE_MUTATION = '';

const updateGqlCache = (cache: any, { data: { createGame } }: any) => {
  try {
    const { games } = cache.readQuery({ query: GAME_LIST_QUERY, variables: {
      name: '',
    } }) as any;

    cache.writeQuery({
      query: GAME_LIST_QUERY,
      variables: {
        name: '',
      },
      data: { games: games.concat([createGame]) },
    });
  } catch (e) {
    logger.warn(e);
  }
};

export default () => {
  const history = useHistory();

  // Change this to useMutation
  const [createGame, { error }] = [
    async (args: any) => {},
    {
      error: '',
    },
  ];

  const [nameInputValue, setNameInputValue] = useState('');
  const [descriptionInputValue, setDescriptionInputValue] = useState('');
  const [urlInputValue, setUrlInputValue] = useState('');
  const [platformSelectValue, setPlatformSelectValue] = useState('1');
  const [submitted, setSubmitted] = useState(false);

  const submitCreateHandler = (event: FormEvent) => {
    event.preventDefault();
    setSubmitted(true);

    // This function needs the "variables" option with the needed parameters to create a game
    createGame({
    }).then(() => history.goBack())
      .catch(() => {});
  };

  const changeNameFieldHandler = (event: ChangeEvent) => {
    setNameInputValue((event?.target as HTMLInputElement).value);
  };

  const changeDescriptionFieldHandler = (event: ChangeEvent) => {
    setDescriptionInputValue((event?.target as HTMLInputElement).value);
  };

  const changeUrlFieldHandler = (event: ChangeEvent) => {
    setUrlInputValue((event?.target as HTMLInputElement).value);
  };

  const changePlatformSelectHandler = (event: ChangeEvent) => {
    setPlatformSelectValue((event?.target as HTMLSelectElement).value);
  };

  if (error) {
    logger.warn(error);
    return (<div className="section"><h2 className="title">Error creating the game</h2></div>);
  }

  if (submitted) {
    return <ProgressBar />;

  }

  return (
    <div className="section">
      <h2 className="title is-3">List of games</h2>
      <form onSubmit={submitCreateHandler}>
        <div className="field" >
          <label className="label" htmlFor="name-input">Name</label>
          <div className="control is-expanded">
            <input
              id="name-input"
              required={true}
              className="input"
              type="text"
              value={nameInputValue}
              onChange={changeNameFieldHandler}
            />
          </div>
        </div>
        <div className="field" >
          <label className="label" htmlFor="description-input">Description</label>
          <div className="control is-expanded">
            <input
              id="description-input"
              className="input"
              type="text"
              value={descriptionInputValue}
              onChange={changeDescriptionFieldHandler}
            />
          </div>
        </div>
        <div className="field" >
          <label className="label" htmlFor="url-input">Url</label>
          <div className="control is-expanded">
            <input
              id="url-input"
              className="input"
              type="text"
              value={urlInputValue}
              onChange={changeUrlFieldHandler}
            />
          </div>
        </div>
        <div className="field" >
          <label className="label" htmlFor="platform-select">Platform</label>
          <div className="control is-expanded">
            <div className="select">
              <select
                id="platform-select"
                value={platformSelectValue}
                onChange={changePlatformSelectHandler}
              >
                <option value="1">Super Nintendo</option>
              </select>
            </div>
          </div>
        </div>
        <div className="control">
          <button className="button is-info">Submit</button>
        </div>
      </form>
      <br/>
    </div>
  );
};
