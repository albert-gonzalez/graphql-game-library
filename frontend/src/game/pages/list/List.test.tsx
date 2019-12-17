import React from 'react';
import { render, wait } from '@testing-library/react';
import { MockedProvider, MockedResponse } from '@apollo/react-testing';
import { Route, Router } from 'react-router-dom';
import List, { GAME_LIST_QUERY } from './List';
import { createMemoryHistory } from 'history';

describe('Game List page', () => {
  test('the first time renders a loading screen', () => {
    const { getByText } = render(createComponent(okMock));

    expect(getByText(/15%/i)).toBeInTheDocument();
  });

  test('renders the lists if the API call is OK', async() => {
    const { getAllByText } = render(createComponent(okMock));

    await wait(() => {
      expect(getAllByText(/game name/i).length).toEqual(2);
      expect(getAllByText(/game description/i).length).toEqual(2);
      expect(getAllByText(/platform name/i).length).toEqual(2);
    },         { timeout: 100 });
  });

  test('renders the lists if the API call is OK when is a search', async() => {
    const history = createMemoryHistory();
    history.push('/game/search/awesome');
    const { getByText } = render(createComponent(okMock, history));

    await wait(() => {
      expect(getByText(/found game name/i)).toBeInTheDocument();
      expect(getByText(/found game description/i)).toBeInTheDocument();
      expect(getByText(/found game platform name/i)).toBeInTheDocument();
    },         { timeout: 100 });
  });

  // tslint:disable-next-line:max-line-length
  test('renders No games found if the API call is OK when is a search but any game was found', async() => {
    const history = createMemoryHistory();
    history.push('/game/search/awful');
    const { getByText } = render(createComponent(okMock, history));

    await wait(() => {
      expect(getByText(/no games found/i)).toBeInTheDocument();
    },         { timeout: 100 });
  });

  test('navigates to game show view if the link is clicked', async() => {
    const history = createMemoryHistory();
    const { getByText } = render(createComponent(okMock, history));

    await wait(() => {
      getByText(/game name 1/i).click();
      expect(history.location.pathname).toEqual('/game/1');
    },         { timeout: 500 });
  });

  test('renders Error loading if some error is found in the API', async() => {
    const { getByText } = render(createComponent(errorMock));

    await wait(() => {
      expect(getByText(/Error loading/i)).toBeInTheDocument();
    },         { timeout: 100 });
  });
});

const createComponent = (gqlMocks: MockedResponse[], history = createMemoryHistory()) => (
  <MockedProvider mocks={gqlMocks} addTypename={false}>
    <Router history={history}>
      <Route path="/game/search/:search">
        <List />
      </Route>
      <Route path="/">
        <List />
      </Route>
    </Router>
  </MockedProvider>

);

const okMock = [
  {
    request: {
      query: GAME_LIST_QUERY,
      variables: {
        name: '',
      },
    },
    result: {
      data: {
        games: [
          {
            id: 1,
            name: 'game name 1',
            description: 'game description 1',
            url: 'game url 1',
            platform: {
              id: 2,
              name: 'platform name 1',
            },
          },
          {
            id: 2,
            name: 'game name 2',
            description: 'game description 2',
            url: 'game url 2',
            platform: {
              id: 3,
              name: 'platform name 2',
            },
          },
        ],
      },
    },
  },
  {
    request: {
      query: GAME_LIST_QUERY,
      variables: {
        name: 'awesome',
      },
    },
    result: {
      data: {
        games: [
          {
            id: 1,
            name: 'found game name',
            description: 'found game description 1',
            url: 'found game url 1',
            platform: {
              id: 2,
              name: 'found game platform name 1',
            },
          },
        ],
      },
    },
  },
  {
    request: {
      query: GAME_LIST_QUERY,
      variables: {
        name: 'awful',
      },
    },
    result: {
      data: {
        games: [
        ],
      },
    },
  },
];

const errorMock = [
  {
    request: {
      query: GAME_LIST_QUERY,
    },
    error: new Error('Boom'),
  },
];
