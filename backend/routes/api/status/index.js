"use strict";
const responseUtils = require("../../../utils/responseUtils");

module.exports = async function (fastify, opts) {
  fastify.get("/", async (request, reply) => {
    const kubeContext = fastify.kube.currentContext;
    let body = {};
    const { currentContext, namespace, currentUser } = fastify.kube;
    if (!kubeContext && !kubeContext.trim()) {
      body.status = "Error";
      body.message = "Unable to connect to Kube API";
      reply.code(500);
    } else {
      body.status = "OK";
      body.kube = {
        currentContext,
        currentUser,
        namespace,
      };
      reply.code(200);
    }
    responseUtils.addCORSHeader(request, reply);
    reply.send(body);
    return reply;
  });
};
