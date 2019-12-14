import ApolloClient from 'apollo-boost';

const client = new ApolloClient({
  uri: process.env.REACT_APP_API_URL,
  headers: {
    apikey: process.env.REACT_APP_API_KEY,
  },
});

export default client;
