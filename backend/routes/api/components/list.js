const _ = require('lodash');
const availableComponents = require('../../../components/available-components');

module.exports = async function ({ fastify, opts, request, reply }) {
  return await Promise.all(
    availableComponents.map(async (ac) => {
      return _.pick(ac, ['key', 'label', 'description', 'img', 'docsLink', 'support']);
    })
  );
};
