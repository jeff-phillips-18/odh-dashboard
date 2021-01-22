'use strict';

const fastify = require('fastify');
const { APP_ENV, PORT, IP, LOG_LEVEL } = require('./utils/constants');

const app = fastify({
  logger: {
    level: LOG_LEVEL,
  },
  pluginTimeout: 10000,
});

app.register(require('./app.js'));

app.listen(PORT, IP, (err) => {
  if (err) {
    app.log.error(err);
    process.exit(1); // eslint-disable-line
  }
  console.log(`APP_ENV: ${process.env.APP_ENV} or ${APP_ENV}`);
  console.log(`default NODE_ENV: ${process.env.NODE_ENV}`);
  console.log('Fastify Connected...');
  console.log(
    `Server listening on >>>  ${app.server.address().address}:${app.server.address().port}`,
  );
});
