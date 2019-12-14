import React from 'react';
import './App.scss';
import List from './game/pages/list/List';
import { ApolloProvider } from '@apollo/react-hooks';
import client from './common/services/graphql/client';
import {
    BrowserRouter as Router,
    Switch,
    Route,
    Link,
} from 'react-router-dom';
import Show from './game/pages/show/Show';

export default () => {
  return (
    <Router>
        <div className="app">
            <section className="hero is-info">
                <div className="hero-body">
                    <div className="container">
                        <h1 className="title is-2">
                            <Link className="has-text-white" to="/">
                                <span role="img" aria-label="Awesome VGL">🎮 </span>
                                Awesome Video Game Library
                                <span role="img" aria-label="Awesome VGL"> 🎮</span>
                            </Link>
                        </h1>
                    </div>
                </div>
            </section>

            <ApolloProvider client={client}>
                <div className="container">
                    <Switch>
                        <Route path="/game/:id">
                            <Show />
                        </Route>
                        <Route path="/">
                            <List />
                        </Route>
                    </Switch>
                </div>
            </ApolloProvider>
        </div>
    </Router>
  );
};
