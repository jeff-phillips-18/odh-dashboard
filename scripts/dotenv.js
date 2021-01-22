const path = require('path');
const dotenv = require('dotenv');

/**
 * Setup, and access, a dotenv file and the related set of parameters.
 *
 * @param {string} path
 * @returns {*}
 */
const setupDotenvFile = path => dotenv.config({ path });

/**
 * Setup and access local and specific dotenv file parameters.
 *
 * @param {string} env
 */
const setupDotenvFilesForEnv = ({ env }) => {
  const RELATIVE_DIRNAME = path.resolve(__dirname, '..');

  if (env) {
    console.log(`=== ENV ${env}`);
    console.log(`  env file: ${path.resolve(RELATIVE_DIRNAME, `.env.${env}.local`)}`);
    console.log(`  env file: ${path.resolve(RELATIVE_DIRNAME, `.env.${env}.local`)}`);
    setupDotenvFile(path.resolve(RELATIVE_DIRNAME, `.env.${env}.local`));
    setupDotenvFile(path.resolve(RELATIVE_DIRNAME, `.env.${env}`));
  }

  setupDotenvFile(path.resolve(RELATIVE_DIRNAME, '.env.local'));
  setupDotenvFile(path.resolve(RELATIVE_DIRNAME, '.env'));

  console.log(
    `Loading project dotenv parameters... ${JSON.stringify(
      Object.keys(process.env)
        .filter(key => /^[A-Z]/.test(key))
        .map(key => ({ [key]: process.env[key] }))
    )}`
  );
};

setupDotenvFilesForEnv({ env: process.env && process.env.NODE_ENV });
