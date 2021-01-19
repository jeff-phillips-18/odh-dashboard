const _ = require('lodash');

const getLink = async (fastify, routeName) => {
  const customObjectsApi = fastify.kube.customObjectsApi;
  const namespace = fastify.kube.namespace;
  try {
    const res = await customObjectsApi.getNamespacedCustomObject(
      'route.openshift.io',
      'v1',
      namespace,
      'routes',
      routeName
    );
    const host = _.get(res, 'body.spec.host');
    const tlsTerm = _.get(res, 'body.spec.tls.termination');
    const protocol = tlsTerm ? 'https' :' "http"';
    return `${protocol}://${host}`;
  } catch (e) {
    fastify.log.error(e, `failed to get route ${routeName}`);
    return null;
  }
};

const getInstalledKfdefs = async (fastify) => {
  const customObjectsApi = fastify.kube.customObjectsApi;
  const namespace = fastify.kube.namespace;

  let kfdef;
  try {
    const res = await customObjectsApi.listNamespacedCustomObject(
      'kfdef.apps.kubeflow.org',
      'v1',
      namespace,
      'kfdefs'
    );
    kfdef = _.get(res, 'body.items[0]');
  } catch (e) {
    fastify.log.error(e, 'failed to get kfdefs');
    throw e;
  }

  return _.get(kfdef, 'spec.applications') || [];
};

module.exports = { getInstalledKfdefs, getLink };