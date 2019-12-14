import React from 'react';
import { render, wait } from '@testing-library/react';
import { MockedProvider, MockedResponse } from '@apollo/react-testing';
import Show, { GAME_QUERY } from './Show';
import { MemoryRouter, Route } from 'react-router-dom';

describe('Game Show page', () => {
  test('the first time renders a loading screen', () => {
    const { getByText } = render(createComponent(okMock));

    expect(getByText(/15%/i)).toBeInTheDocument();
  });

  test('renders the game if game exists in the API', async() => {
    const { getByText } = render(createComponent(okMock));

    await wait(() => {
      expect(getByText(/game name/i)).toBeInTheDocument();
      expect(getByText(/game description/i)).toBeInTheDocument();
      expect(getByText(/Go to Giant Bomb page/i).getAttribute('href')).toEqual('game url');
      expect(getByText(/platform name/i)).toBeInTheDocument();
    },         { timeout: 100 });
  });

  test('renders 404 Not Found if some error is found in the API', async() => {
    const { getByText } = render(createComponent(errorMock));

    await wait(() => {
      expect(getByText(/Not found/i)).toBeInTheDocument();
    },         { timeout: 100 });
  });

  test('renders id needed if id is not provided', async() => {
    const { getByText } = render(createComponent(errorMock, '/game'));

    await wait(() => {
      expect(getByText(/id needed/i)).toBeInTheDocument();
    },         { timeout: 100 });
  });
});

const createComponent = (gqlMocks: MockedResponse[], path = '/game/:id') => (
  <MemoryRouter initialEntries={['/game/1']}>
    <MockedProvider mocks={gqlMocks} addTypename={false}>
      <Route path={path}>
        <Show />
      </Route>
    </MockedProvider>
  </MemoryRouter>
);

const okMock = [
  {
    request: {
      query: GAME_QUERY,
      variables: {
        id: 1,
      },
    },
    result: {
      data: {
        game: {
          id: 1, name: 'game name',
          description: 'game description',
          url: 'game url',
          platform: {
            id: 2,
            name: 'platform name',
          },
        },
      },
    },
  },
];

const errorMock = [
  {
    request: {
      query: GAME_QUERY,
      variables: {
        id: 1,
      },
    },
    error: new Error('Boom'),
  },
];
