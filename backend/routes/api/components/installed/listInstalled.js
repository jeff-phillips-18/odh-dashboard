const _ = require('lodash');
const availableComponents = require('../../../../components/available-components');
const componentUtils = require('../../../../components/componentUtils');

module.exports = async function ({ fastify, opts, request, reply }) {
  let kfdefApps = await componentUtils.getInstalledKfdefs(fastify);

  const installedComponents = kfdefApps.reduce((acc, kfdefApp) => {
    const component = availableComponents.find((ac) =>
      ac.kfdefApplications && ac.kfdefApplications.includes(kfdefApp.name));
    if (component && !acc.includes(component)) {
      acc.push(component);
    }
    return acc;
  }, []);

  return await Promise.all(
    installedComponents.map(async (ac) => {
      const installedComponent = _.pick(ac, ['key', 'label', 'description', 'img', 'docsLink', 'support']);
      installedComponent.enabled = true;
      if (ac.route) {
        installedComponent.link = await componentUtils.getLink(fastify, ac.route);
      }
      return installedComponent;
    })
  );
};
