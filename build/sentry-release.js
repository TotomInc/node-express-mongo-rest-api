/*
  eslint
    no-console: "off",
    @typescript-eslint/no-var-requires: "off"
*/
const { execSync } = require('child_process');
const path = require('path');
const chalk = require('chalk');
const dotenv = require('dotenv');

dotenv.config();

const findArgumentValue = require('./find-argument-value');

const sentryOrg = process.env.SENTRY_ORG;
const sentryToken = process.env.SENTRY_TOKEN;
const sentryProject = process.env.SENTRY_PROJECT;
const sentryRelease = process.env.SENTRY_RELEASE;
const sourceMapsPath = path.join(__dirname, '../dist');

const environmentArg = findArgumentValue('--environment', '-e', true);

const prefix = `${chalk.gray('[')}${chalk.cyan('sentry-release')}${chalk.gray(']')}`;

console.log(prefix, `Uploading sourcemaps for @${sentryOrg}/${sentryProject}, release ${sentryRelease}`);

execSync(
  `sentry-cli --auth-token ${sentryToken} releases --org ${sentryOrg} --project ${sentryProject} files ${sentryRelease} upload-sourcemaps ${sourceMapsPath} --no-rewrite`,
  {
    stdio: 'inherit',
  },
);

console.log(
  prefix,
  `Sourcemaps uploaded, now creating a new Sentry production release for @${sentryOrg}/${sentryProject}`,
);

execSync(
  `sentry-cli --auth-token ${sentryToken} releases --org ${sentryOrg} --project ${sentryProject} deploys ${sentryRelease} new -e ${environmentArg}`,
  {
    stdio: 'inherit',
  },
);

console.log(prefix, `@${sentryOrg}/${sentryProject} release ${sentryRelease} have been deployed on Sentry`);
