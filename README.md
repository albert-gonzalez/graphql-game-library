# GraphQL Game Library Example

## How to install

* Clone this repository
* Go to the repository path
* run:
    * Local:
      * First, run `npm install` to install node_modules.
      * Run `npm run build:dev` or `npm run prod` to run in dev or prod mode
      * Run `npm test` to run tests
    * Docker:
      * Run `docker-compose up` to install node_modules and init pm2.
      * Run `docker-compose run --service-ports games npm run build:dev` to run in devel mode.
      * Run `docker-compose run --service-ports games npm test` to run tests
* Open `http://localhost:4000` in the browser
