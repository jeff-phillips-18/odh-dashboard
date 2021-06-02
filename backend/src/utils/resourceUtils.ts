import * as jsYaml from 'js-yaml';
import createError from 'http-errors';
import {
  BuildStatus,
  CSVKind,
  K8sResourceCommon,
  KfDefApplication,
  KfDefResource,
  KubeFastifyInstance,
  ODHApp,
  ODHDoc,
} from '../types';
import { ResourceWatcher } from './resourceWatcher';
import path from 'path';
import { getComponentFeatureFlags } from './features';
import fs from 'fs';
import { yamlRegExp } from './constants';

let operatorWatcher: ResourceWatcher<CSVKind>;
let serviceWatcher: ResourceWatcher<K8sResourceCommon>;
let appWatcher: ResourceWatcher<ODHApp>;
let docWatcher: ResourceWatcher<ODHDoc>;
let kfDefWatcher: ResourceWatcher<KfDefApplication>;
let buildsWatcher: ResourceWatcher<any>;

const fetchInstalledOperators = (fastify: KubeFastifyInstance): Promise<CSVKind[]> => {
  return fastify.kube.customObjectsApi
    .listNamespacedCustomObject('operators.coreos.com', 'v1alpha1', '', 'clusterserviceversions')
    .then((res) => {
      const csvs = (res?.body as { items: CSVKind[] })?.items;
      if (csvs?.length) {
        return csvs.reduce((acc, csv) => {
          if (csv.status?.phase === 'Succeeded' && csv.status?.reason === 'InstallSucceeded') {
            acc.push(csv);
          }
          return acc;
        }, []);
      }
      return [];
    })
    .catch((e) => {
      console.error(e, 'failed to get ClusterServiceVersions');
      return [];
    });
};

const fetchServices = (fastify: KubeFastifyInstance) => {
  return fastify.kube.coreV1Api
    .listServiceForAllNamespaces()
    .then((res) => {
      return res?.body?.items;
    })
    .catch((e) => {
      console.error(e, 'failed to get Services');
      return [];
    });
};

const fetchInstalledKfdefs = async (fastify: KubeFastifyInstance): Promise<KfDefApplication[]> => {
  const customObjectsApi = fastify.kube.customObjectsApi;
  const namespace = fastify.kube.namespace;

  let kfdef: KfDefResource;
  try {
    const res = await customObjectsApi.listNamespacedCustomObject(
      'kfdef.apps.kubeflow.org',
      'v1',
      namespace,
      'kfdefs',
    );
    kfdef = (res?.body as { items: KfDefResource[] })?.items?.[0];
  } catch (e) {
    fastify.log.error(e, 'failed to get kfdefs');
    const error = createError(500, 'failed to get kfdefs');
    error.explicitInternalServerError = true;
    error.error = 'failed to get kfdefs';
    error.message =
      'Unable to load Kubeflow resources. Please ensure the Open Data Hub operator has been installed.';
    throw error;
  }

  return kfdef?.spec?.applications || [];
};

const fetchApplicationDefs = (): Promise<ODHApp[]> => {
  const normalizedPath = path.join(__dirname, '../../../data/applications');
  const applicationDefs: ODHApp[] = [];
  const featureFlags = getComponentFeatureFlags();
  fs.readdirSync(normalizedPath).forEach((file) => {
    if (yamlRegExp.test(file)) {
      try {
        const doc = jsYaml.load(fs.readFileSync(path.join(normalizedPath, file), 'utf8'));
        if (!doc.spec.featureFlag || featureFlags[doc.spec.featureFlag]) {
          applicationDefs.push(doc);
        }
      } catch (e) {
        console.error(`Error loading application definition ${file}: ${e}`);
      }
    }
  });
  return Promise.resolve(applicationDefs);
};

const fetchDocs = async (): Promise<ODHDoc[]> => {
  const normalizedPath = path.join(__dirname, '../../../data/docs');
  const docs: ODHDoc[] = [];
  const featureFlags = getComponentFeatureFlags();
  const appDefs = await fetchApplicationDefs();

  fs.readdirSync(normalizedPath).forEach((file) => {
    if (yamlRegExp.test(file)) {
      try {
        const doc: ODHDoc = jsYaml.load(fs.readFileSync(path.join(normalizedPath, file), 'utf8'));
        if (doc.spec.featureFlag) {
          if (featureFlags[doc.spec.featureFlag]) {
            docs.push(doc);
          }
          return;
        }
        if (!doc.spec.appName || appDefs.find((def) => def.metadata.name === doc.spec.appName)) {
          docs.push(doc);
        }
      } catch (e) {
        console.error(`Error loading doc ${file}: ${e}`);
      }
    }
  });
  return Promise.resolve(docs);
};

const getBuildConfigStatus = (fastify: KubeFastifyInstance, bcName: string): Promise<string> => {
  return fastify.kube.customObjectsApi
    .listNamespacedCustomObject(
      'build.openshift.io',
      'v1',
      fastify.kube.namespace,
      'builds',
      undefined,
      undefined,
      undefined,
      `buildconfig=${bcName}`,
    )
    .then((res) => {
      const bcBuilds = (res?.body as {
        items: { metadata: { name: string }; status: { phase: string } }[];
      })?.items;
      if (bcBuilds.length === 0) {
        return 'pending';
      }
      const mostRecent = bcBuilds
        .sort((bc1, bc2) => {
          const name1 = parseInt(bc1.metadata.name.split('_').pop());
          const name2 = parseInt(bc2.metadata.name.split('_').pop());
          return name1 - name2;
        })
        .pop();
      return mostRecent.status.phase;
    })
    .catch((e) => {
      console.dir(e);
      return 'pending';
    });
};

export const fetchBuilds = async (fastify: KubeFastifyInstance): Promise<BuildStatus[]> => {
  const nbBuildConfigNames: string[] = await fastify.kube.customObjectsApi
    .listNamespacedCustomObject(
      'build.openshift.io',
      'v1',
      fastify.kube.namespace,
      'buildconfigs',
      undefined,
      undefined,
      undefined,
      'opendatahub.io/build_type=notebook_image',
    )
    .then((res) => {
      const buildConfigs = (res?.body as { items: { metadata: { name: string } }[] })?.items;
      return buildConfigs.map((bc) => bc.metadata.name);
    })
    .catch((e) => {
      return [];
    });
  const baseBuildConfigNames: string[] = await fastify.kube.customObjectsApi
    .listNamespacedCustomObject(
      'build.openshift.io',
      'v1',
      fastify.kube.namespace,
      'buildconfigs',
      undefined,
      undefined,
      undefined,
      'opendatahub.io/build_type=base_image',
    )
    .then((res) => {
      const buildConfigs = (res?.body as { items: { metadata: { name: string } }[] })?.items;
      return buildConfigs.map((bc) => bc.metadata.name);
    })
    .catch((e) => {
      return [];
    });

  const buildConfigNames = [...nbBuildConfigNames, ...baseBuildConfigNames];

  const getters = buildConfigNames.map(async (name) => {
    return getBuildConfigStatus(fastify, name).then((status) => ({ name, status }));
  });

  return Promise.all(getters);
};

export const initializeWatchedResources = (fastify: KubeFastifyInstance): void => {
  operatorWatcher = new ResourceWatcher<CSVKind>(fastify, fetchInstalledOperators);
  serviceWatcher = new ResourceWatcher<K8sResourceCommon>(fastify, fetchServices);
  kfDefWatcher = new ResourceWatcher<KfDefApplication>(fastify, fetchInstalledKfdefs);
  appWatcher = new ResourceWatcher<ODHApp>(fastify, fetchApplicationDefs);
  docWatcher = new ResourceWatcher<ODHDoc>(fastify, fetchDocs);
  buildsWatcher = new ResourceWatcher<BuildStatus>(fastify, fetchBuilds);
};

export const getInstalledOperators = (): K8sResourceCommon[] => {
  return operatorWatcher.getResources();
};

export const getServices = (): K8sResourceCommon[] => {
  return serviceWatcher.getResources();
};

export const getInstalledKfdefs = (): KfDefApplication[] => {
  return kfDefWatcher.getResources();
};
export const getApplicationDefs = (): ODHApp[] => {
  return appWatcher.getResources();
};

export const getApplicationDef = (appName: string): ODHApp => {
  const appDefs = getApplicationDefs();
  return appDefs.find((appDef) => appDef.metadata.name === appName);
};

export const getDocs = (): ODHDoc[] => {
  return docWatcher.getResources();
};

export const getBuildStatuses = (): { name: string; status: string }[] => {
  return buildsWatcher.getResources();
};
