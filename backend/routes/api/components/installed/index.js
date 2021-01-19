const listInstalled = require('./listInstalled');
const responseUtils = require('../../../../utils/responseUtils');

module.exports = async function (fastify, opts) {
  fastify.get("/", async (request, reply) => {
    return listInstalled({ fastify, opts, request, reply }, true)
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
