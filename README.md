# GraphQL Game Library Example

## How to install

* Clone this repository
* Go to the repository path
* run `npm install`
* run:
    * Local: `npm run build:dev` or `npm run prod`
    * Docker: `docker-compose up` to install node_modules and init pm2. `docker-compose run --service-ports games npm run build:dev` to run in devel mode. 
* Open `http://localhost:4000` in the browser
