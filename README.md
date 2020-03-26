# Node Express REST-API template

> A template to quickly generate a Node.js REST-API, in TypeScript.

## Getting started

To get the server running locally:

- Install and setup a local MongoDB server.
- Clone the repo.
- `yarn` to install all the dependencies.
- Copy `.env.example` file as `.env` and edit the environment variables.
- `yarn run dev` to run the server locally.

## Overview

### Dependencies

- typescript: JavaScript superset to scale large applications
- mongoose: MongoDB object modeling for Node.js
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

### Commands

- `yarn build`: build TypeScript source-files into the `/dist` directory.
- `yarn dev`: run Nodemon, hot-reload the development server.
- `yarn lint`: run ESLint, print warnings and errors (doesn't auto-fix).
- `yarn lint:fix`: run ESLint and fix all auto-fixable ESLint rules.
- `yarn release`: build source-files and create a production Sentry release.
- `yarn release:staging`: build source-files and create a staging Sentry release.
- `yarn serve-coverage`: start an HTTP server for the coverage directory.
- `yarn start`: execute the compiled app (from `/dist`) in production environment.
- `yarn test`: run Jest tests (`--silent --verbose` as it's meant to be used by CI).
- `yarn test:watch`: run Jest in `--watch` mode.

### Error-handling

There are multiple error handlers already provided in the `config/express.ts` file.

- The first error-handler is the one provided by `celebrate` which will be triggered in case of an invalid HTTP request (invalid headers, body, query parameters, ...).
- A second error-handler for anything that is 404.
- A third error-handler for all the other errors.

If in development, the returned error (as a JSON response) will show the stacktrace to help you debug.

### Testing and CI

Jest is integrated with a sample test (`server/auth/auth.spec.ts`) to give you an idea.

When running `yarn test`, a `/coverage` folder will be generated so you can take a look at the code-coverage by running `yarn serve-coverage`.

CI is powered by GitHub Actions. The configuration file of the GitHub Action is located under `.github/workflow/build.yml`.

### Linting + formatting

Linting is done with ESLint and formatting with Prettier.

There are already a set of ESLint rules which includes TypeScript best-practices, the `.eslintrc.js` extends the [`@totominc/eslint-config-typescript`](https://www.npmjs.com/package/@totominc/eslint-config-typescript) configuration.

### Sentry

[Sentry](https://sentry.io/) is integrated in the project.

Make sure to define Sentry-related environment variables in your `.env` (project DSN, application token, organization, project, release).

#### Releasing a new version

- Update the `SENTRY_RELEASE` environment variable
- Run `yarn release` or `yarn release:staging` depending on the environment you want

Source-maps will be uploaded to Sentry in order to give more context to the errors, which will make debugging easier.

## License

Under MIT license, view the license file for more informations.
