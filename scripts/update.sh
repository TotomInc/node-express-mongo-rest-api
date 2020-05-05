#!/bin/bash
. ./read-json.sh

PACKAGE_NAME=`readJSON ../package.json name` || exit 1;
PROCESS_NAME=`echo "${PACKAGE_NAME//-}"`;

echo "\e[1m\e[36m[$PACKAGE_NAME update-tool] \e[0mUpdating project..."

# Create git up alias because it's harmful to use git pull to update a repo,
# this will add noise to git log in case of branch merging.
# https://stackoverflow.com/a/17101140
git config --global alias.up '!git remote update -p; git merge --ff-only @{u}'

echo "\e[1m\e[36m[$PACKAGE_NAME update-tool] \e[0mUpdating local repository from remote on master branch..."
git checkout master && git up

echo "\e[1m\e[36m[$PACKAGE_NAME update-tool] \e[0mRunning yarn to install dependencies and build from source files..."
yarn install --frozen-lockfile
yarn build

echo "\e[1m\e[36m[$PACKAGE_NAME update-tool] \e[0mRestarting systemd process..."
systemctl restart $PROCESS_NAME
systemctl status $PROCESS_NAME

echo "\e[1m\e[36m[$PACKAGE_NAME update-tool] \e[0mDone!"
