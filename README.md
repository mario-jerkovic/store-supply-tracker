> This project is just made for fun :). This shows best practises that I have learned over past 
  year, playing around with React.js, Relay,js and GraphQL. Fell free to clone, fork or 
  submit PR to correct things that I have made wrong or that could be done better.
  I am allays opened to learn something new. THIS IS STILL WORK IN PROGRESS, and I am updating it on my free time. More 
  features will come like pagination with relay, full feature Material Design Table, .... ENJOY!

## Usage

This project includes DB dump (mysql) as the GraphQL server will look for 'receipt', 'article' and 'receipt_article_map' tables
```bash
dbDump.sql
```

Install all dependencies & Start developing
```bash
$ npm install
$ npm start
```

## Deployment

#### Local machine
In order to deploy a project, it is a good practice to minify all JavaScript files, pull off some duplicate dependencies, and remove all unnecessary scripts, for example, Hot-reload. All of these can be done by executing the following command:

```bash
$ npm run deploy
```

## Project Structure


    ├── client                          - All of the client side code resides in this folder
    │   ├── assets                      - Images and fonts
    │   ├── common                      - React components that are used trought the application
    │   ├── routes                      - React-router-relay 
    │   │   ├── routs.js                - All route definitions
    │   │   └── viewerQuery.js          - Entry node of a GraphQL query
    │   ├── index.html                  - HTML template file used by html-webpack-plugin 
    │   └── index.js                    - Client entry point
    ├── scripts                         - Scripts
    │   └── babelRelayPlugin.js         - Babel-relay-plugin provided by Relay
    ├── server                          - All of the server side code resides in this folder
    │   ├── config                      - Configuration 
    │   │   └── environment             - Separate configuration for each environment
    │   │       ├── development.js      - Development configuration
    │   │       ├── index.js            - Common configuration used in any environment
    │   │       ├── production.js       - Production configuration
    │   │       └── test.js             - Test configuration
    │   └── index.js                    - Server entry point
    ├── package.json                    - List of dependencies
    ├── webpack.config.babel.js         - Webpack configuration
    └── webpack.config.dll.babel.js     - Webpack configuration for building vendor/dll fiels for faster development build's
