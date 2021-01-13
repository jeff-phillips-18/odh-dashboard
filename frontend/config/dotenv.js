const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');
const Dotenv = require('dotenv-webpack');

/**
 * Determine if the project is standalone or nested.
 *
 * @param {string} directory
 * @returns {boolean}
 */
const getProjectIsRootDir = directory => {
  const dotenvLocalFile = path.resolve(directory, '.env.local');
  const dotenvFile = path.resolve(directory, '.env');
  let localIsRoot;
  let isRoot;

  if (fs.existsSync(dotenvLocalFile)) {
    const { OSEED_IS_PROJECT_ROOT_DIR: DOTENV_LOCAL_ROOT } = dotenv.parse(fs.readFileSync(dotenvLocalFile));
    localIsRoot = DOTENV_LOCAL_ROOT;
  }

  if (fs.existsSync(dotenvFile)) {
    const { OSEED_IS_PROJECT_ROOT_DIR: DOTENV_ROOT } = dotenv.parse(fs.readFileSync(dotenvFile));
    isRoot = DOTENV_ROOT;
  }

  return (localIsRoot ?? isRoot) !== 'false';
};

/**
 * Return tsconfig compilerOptions.
 *
 * @param {string} directory
 * @returns {object}
 */
const getTsCompilerOptions = directory => {
  const tsconfigFile = path.resolve(directory, './tsconfig.json');
  let tsCompilerOptions = {};

  if (fs.existsSync(tsconfigFile)) {
    const { compilerOptions = { outDir: './dist', baseUrl: './src' } } = require(tsconfigFile);
    tsCompilerOptions = compilerOptions;
  }

  return tsCompilerOptions;
};

/**
 * Setup a webpack dotenv plugin config.
 *
 * @param {string} path
 * @returns {*}
 */
const setupWebpackDotenvFile = path => {
  const settings = {
    systemvars: true,
    silent: true
  };

  if (path) {
    settings.path = path;
  }

  return new Dotenv(settings);
};

/**
 * Setup multiple webpack dotenv file parameters.
 *
 * @param {string} directory
 * @param {string} env
 * @param {boolean} isRoot
 * @returns {Array}
 */
const setupWebpackDotenvFilesForEnv = ({ directory, env, isRoot = true }) => {
  const dotenvWebpackSettings = [];

  if (env) {
    dotenvWebpackSettings.push(setupWebpackDotenvFile(path.resolve(directory, `.env.${env}.local`)));
    dotenvWebpackSettings.push(setupWebpackDotenvFile(path.resolve(directory, `.env.${env}`)));
  }

  dotenvWebpackSettings.push(setupWebpackDotenvFile(path.resolve(directory, '.env.local')));
  dotenvWebpackSettings.push(setupWebpackDotenvFile(path.resolve(directory, '.env')));

  if (!isRoot) {
    if (env) {
      dotenvWebpackSettings.push(setupWebpackDotenvFile(path.resolve(directory, '..', `.env.${env}.local`)));
      dotenvWebpackSettings.push(setupWebpackDotenvFile(path.resolve(directory, '..', `.env.${env}`)));
    }

    dotenvWebpackSettings.push(setupWebpackDotenvFile(path.resolve(directory, '..', '.env.local')));
    dotenvWebpackSettings.push(setupWebpackDotenvFile(path.resolve(directory, '..', '.env')));
  }

  return dotenvWebpackSettings;
};

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
  const IS_ROOT = getProjectIsRootDir(RELATIVE_DIRNAME);
  const { baseUrl: TS_BASE_URL, outDir: TS_OUT_DIR } = getTsCompilerOptions(RELATIVE_DIRNAME);

  if (env) {
    setupDotenvFile(path.resolve(RELATIVE_DIRNAME, `.env.${env}.local`));
    setupDotenvFile(path.resolve(RELATIVE_DIRNAME, `.env.${env}`));
  }

  setupDotenvFile(path.resolve(RELATIVE_DIRNAME, '.env.local'));
  setupDotenvFile(path.resolve(RELATIVE_DIRNAME, '.env'));

  if (!IS_ROOT) {
    if (env) {
      setupDotenvFile(path.resolve(RELATIVE_DIRNAME, '..', `.env.${env}.local`));
      setupDotenvFile(path.resolve(RELATIVE_DIRNAME, '..', `.env.${env}`));
    }

    setupDotenvFile(path.resolve(RELATIVE_DIRNAME, '..', '.env.local'));
    setupDotenvFile(path.resolve(RELATIVE_DIRNAME, '..', '.env'));
  }

  const IMAGES_DIRNAME = process.env.OSEED_IMAGES_DIRNAME || 'images';
  const PUBLIC_PATH = process.env.OSEED_PUBLIC_PATH || '/';
  const SRC_DIR = path.resolve(RELATIVE_DIRNAME, process.env.OSEED_SRC_DIR || TS_BASE_URL || 'src');
  const DIST_DIR = path.resolve(RELATIVE_DIRNAME, process.env.OSEED_DIST_DIR || TS_OUT_DIR || 'build');
  const HOST = process.env.OSEED_HOST || 'localhost';
  const PORT = process.env.OSEED_PORT || '3000';
  const OUTPUT_ONLY = process.env._OSEED_OUTPUT_ONLY === 'true';

  process.env._OSEED_RELATIVE_DIRNAME = RELATIVE_DIRNAME;
  process.env._OSEED_IS_PROJECT_ROOT_DIR = IS_ROOT;
  process.env._OSEED_IMAGES_DIRNAME = IMAGES_DIRNAME;
  process.env._OSEED_PUBLIC_PATH = PUBLIC_PATH;
  process.env._OSEED_SRC_DIR = SRC_DIR;
  process.env._OSEED_DIST_DIR = DIST_DIR;
  process.env._OSEED_HOST = HOST;
  process.env._OSEED_PORT = PORT;
  process.env._OSEED_OUTPUT_ONLY = OUTPUT_ONLY;

  console.log(
    `Loading dotenv parameters... ${JSON.stringify(
      Object.keys(process.env)
        .filter(key => /^OSEED_/i.test(key))
        .map(key => ({ [key]: process.env[key] }))
    )}`
  );
};

module.exports = { setupWebpackDotenvFilesForEnv, setupDotenvFilesForEnv };
