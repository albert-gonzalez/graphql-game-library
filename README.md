# GraphQL Game Library Example

## How to install

* Clone this repository
* Go to the repository path
* run:
    * Local:
      * Server:
        * Enter the server folder
        * Run `npm install` to install node_modules.
        * Run `npm start` or `npm run build` to run in dev or prod mode
        * Run `npm test` to run tests
      * Frontend:
        * Enter the frontend folder
        * Run `npm install` to install node_modules.
        * Run `npm start` or `npm run build` to run in dev or prod mode
        * Run `npm test` to run tests
    * Docker:
      * Run `docker-compose up` to execute server (localhost:4000) and frontend (localhost:3000) in devel mode.
      * Run `docker-compose run games_server npm test` to run  server tests
      * Run `docker-compose run games_frontend npm test` to run server tests
* Open `http://localhost:4000` in the browser to access GraphQL Playground
* Open `http://localhost:3000` in the browser to access the frontend app