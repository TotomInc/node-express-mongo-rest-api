# Node Express REST-API template

> A template to quickly generate a Node.js REST-API, in TypeScript.

## Getting started

To get the server running locally:

- Clone the repo
- `yarn` to install all the dependencies
- Copy `.env.example` file as `.env` and edit the environment variables.
- `yarn run dev` to run the server locally

## Overview

### Dependencies

- typescript: JavaScript superset to scale large applications
- express: HTTP server for handling routing
- express-jwt: JSON Web Token authentication middleware
- celebrate: express middleware for handling validation
- body-parser: express body parsing middleware
- cors: express middleware to enable cors on specific routes
- helmet: secure express apps with various HTTP headers
- jsonwebtoken: JSON Web Token implement for Node
- uuid: generate RFC4122 (v1, v4, and v5) UUIDs
- dotenv: load environment variables from a `.env` file
- module-aliases: create aliases of directories and register custom module paths (used for TypeScript custom paths)
- jest: test-runner

### Structure

- `.env.example` an example of environment variables that are used in this template.
- `index.ts` entry point of the application.
- `build/` scripts used for deployment.
- `config/` various configuration files (express, sentry, environment variables, ...).
- `interfaces/` contains various TypeScript interfaces.
- `server/` contains a folder for every route, this is the main Express logic for all of your routes.
- `types/` override specific modules `*.d.ts.` typings.

### Error-handling

There are multiple error handlers already provided in the `config/express.ts` file.

- The first error-handler is the one provided by `celebrate` which will be triggered in case of an invalid HTTP request (invalid headers, body, query parameters, ...).
- A second error-handler for anything that is 404.
- A third error-handler for all the other errors.

If in development, the returned error (as a JSON response) will show the stacktrace to help you debug.

## License

Under MIT license, view the license file for more informations.
