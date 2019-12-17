import React from 'react';
import { render, wait, fireEvent } from '@testing-library/react';
import { MockedProvider, MockedResponse } from '@apollo/react-testing';
import { createMemoryHistory, MemoryHistory } from 'history';
import { Route, Router } from 'react-router-dom';
import Create, { GAME_CREATE_MUTATION } from './Create';

const GAME_NAME = 'game name';
const GAME_DESCRIPTION = 'game description';
const GAME_URL = 'game url';
const GAME_PLATFORM = '1';

describe('Create game page', () => {
  let history: MemoryHistory;

  beforeEach(() => {
    history = createMemoryHistory();
    history.push('/game/create');
  });

  test('it renders the form with game fields',  async() => {
    const { getByText } = render(createComponent([], history));

    await wait(() => {
      expect(getByText(/name/i)).toBeInTheDocument();
      expect(getByText(/description/i)).toBeInTheDocument();
      expect(getByText(/url/i)).toBeInTheDocument();
      expect(getByText(/platform/i)).toBeInTheDocument();
    },         { timeout: 500 });
  });

  // tslint:disable-next-line:max-line-length
  test('it calls the API and redirects to the root when the form is submitted and the call is OK',  async() => {
    const { getByLabelText, getByText } = render(createComponent(okMock, history));

    await wait(() => submitForm(getByLabelText, getByText), { timeout: 500 });

    await wait(() => {
      expect(history.location.pathname).toEqual('/');
    },         { timeout: 500 });
  });

  // tslint:disable-next-line:max-line-length
  test('it calls the API and shows an error when the form is submitted and the call is KO',  async() => {
    const { getByLabelText, getByText } = render(createComponent([], history));

    await wait(() => submitForm(getByLabelText, getByText), { timeout: 500 });

    await wait(() => {
      expect(getByText(/error/i)).toBeInTheDocument();
    },         { timeout: 500 });
  });
});

const createComponent = (gqlMocks: MockedResponse[], history: MemoryHistory) => (
  <MockedProvider mocks={gqlMocks} addTypename={false}>
    <Router history={history}>
      <Route path="/game/create">
        <Create />
      </Route>
    </Router>
  </MockedProvider>
);

const submitForm = (getByLabelText: Function, getByText: Function) => {
  fireEvent.change(getByLabelText(/name/i), { target: { value: GAME_NAME } });
  fireEvent.change(getByLabelText(/description/i), { target: { value: GAME_DESCRIPTION } });
  fireEvent.change(getByLabelText(/url/i), { target: { value: GAME_URL } });
  fireEvent.change(getByLabelText(/platform/i), { target: {  value: GAME_PLATFORM } });
  fireEvent.click(getByText(/submit/i));
};

const okMock = [
  {
    request: {
      query: GAME_CREATE_MUTATION,
      variables: {
        input: {
          name: GAME_NAME,
          description: GAME_DESCRIPTION,
          url: GAME_URL,
          platform_id: parseInt(GAME_PLATFORM, 10),
        },
      },
    },
    result: {
      data: {
        createGame:
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
      },
    },
  },
];
