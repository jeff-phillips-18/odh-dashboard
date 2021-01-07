#!/usr/bin/env bash
printf "\n\n######## dev frontend ########\n"

DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" >/dev/null 2>&1 && pwd )"

cd ${DIR}/../frontend
pwd

yarn
yarn start:dev
