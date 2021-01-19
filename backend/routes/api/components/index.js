const list = require('./list');
const responseUtils = require('../../../utils/responseUtils');

module.exports = async function (fastify, opts) {
  fastify.get('/', async (request, reply) => {
    return list({ fastify, opts, request, reply })
      .then((res) => {
        responseUtils.addCORSHeader(request, reply);
        return res;
      })
      .catch((res) => {
        responseUtils.addCORSHeader(request, reply);
        return res;
      });
  });
};
