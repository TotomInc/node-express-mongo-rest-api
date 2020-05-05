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

### Deployments

Deployments have been tested on Ubuntu 18.04 LTS and we recommend Ubuntu.

We are using `systemd` instead of [`pm2`](https://pm2.keymetrics.io/) or [`forever`](https://www.npmjs.com/package/forever) to gain more control on the node process.

> Please, do not use `pm2` as there are some issues when accessing _root_ files such as SSL keys. You need to mess with PM2 settings and create a new PM2 user with appropriate permissions. The `systemd` method is easier, more stable, native and lets you have more control on the node process.

#### Setup environment

1. Create a `node` user to run the process and switch to that user:

   - `sudo adduser node`
   - `su - node`

2. Install [`nvm`](https://github.com/nvm-sh/nvm#installing-and-updating) with latest v12 LTS:

   - `curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.35.3/install.sh | bash`

3. Install [`yarn`](https://classic.yarnpkg.com/en/docs/install/#debian-stable):

   - `curl -sS https://dl.yarnpkg.com/debian/pubkey.gpg | sudo apt-key add -`
   - `echo "deb https://dl.yarnpkg.com/debian/ stable main" | sudo tee /etc/apt/sources.list.d/yarn.list`
   - `sudo apt update && sudo apt install yarn`

4. Clone the repository, run `yarn` and `yarn build`.

5. Make sure to fill environment variables:
   - `cp .env.example .env`

#### Setup process

> **Note**: if you don't edit the `scripts/update.sh` manually, it will use the name property from the `package.json` as the service name (without hyphens) when running `systemctl` commands (referred to `<myservice>` in this section).

1. Create a process configuration file `/etc/systemd/system/<myservice>.service` containing the following:

   ```bash
   [Unit]
   Description=<my-service-description>

   [Service]
   EnvironmentFile=-/etc/default/<myservice>
   ExecStart=/home/node/.nvm/versions/node/<current-lts>/bin/node /home/node/<project-name>/dist/index.js
   WorkingDirectory=/home/node/<project-name>
   LimitNOFILE=4096
   IgnoreSIGPIPE=false
   KillMode=process
   User=node
   SyslogIdentifier=<my-service-identifier>

   [Install]
   WantedBy=multi-user.target
   ```

2. Create an environment file `/etc/default/<myservice>` containing the following:

   ```bash
   # Feel free to add other required environment variables.
   NODE_ENV=production
   ```

3. Make the all the scripts executable with `chmod +x ./scripts/*.sh`.
4. Enable the process on startup `systemctl enable <myservice>`.
5. Start the process `systemctl start <myservice>`.
6. Verify everything is working well `systemctl status <myservice> --l --no-pager`.
   - You can also use `lsof -i -p <api-port>` to verify the Node process is actually listening on the specified port(s).

#### Restarting the API

- Run `scripts/update.sh` to automatically pull changes, install dependencies, build from source and restart `systemctl` process.

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
