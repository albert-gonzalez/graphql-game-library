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

  test('navigates to game show view if the link is clicked', async() => {
    const history = createMemoryHistory();
    const { getByText } = render(createComponent(okMock, history));

    await wait(() => {
      getByText(/game name 1/i).click();
      expect(history.location.pathname).toEqual('/game/1');
    },         { timeout: 500 });
  });

  test('renders 404 Not Found if some error is found in the API', async() => {
    const { getByText } = render(createComponent(errorMock));

    await wait(() => {
      expect(getByText(/Error loading/i)).toBeInTheDocument();
    },         { timeout: 100 });
  });
});

const createComponent = (gqlMocks: MockedResponse[], history = createMemoryHistory()) => (
  <Router history={history}>
    <MockedProvider mocks={gqlMocks} addTypename={false}>
      <Route path="/">
        <List />
      </Route>
    </MockedProvider>
  </Router>
);

const okMock = [
  {
    request: {
      query: GAME_LIST_QUERY,
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
];

const errorMock = [
  {
    request: {
      query: GAME_LIST_QUERY,
    },
    error: new Error('Boom'),
  },
];
