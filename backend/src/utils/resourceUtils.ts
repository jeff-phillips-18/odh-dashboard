import createError from 'http-errors';
import {
  ConsoleApplication,
  ConsoleDocument,
  CSVKind,
  K8sResourceCommon,
  KfDefApplication,
  KfDefResource,
  KubeFastifyInstance,
} from '../types';
import { ResourceWatcher } from './resourceWatcher';
//import { getComponentFeatureFlags } from './features';

let operatorWatcher: ResourceWatcher<CSVKind>;
let serviceWatcher: ResourceWatcher<K8sResourceCommon>;
let appWatcher: ResourceWatcher<ConsoleApplication>;
let docWatcher: ResourceWatcher<ConsoleDocument>;
let kfDefWatcher: ResourceWatcher<KfDefApplication>;

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

const fetchConsoleApplications = async (
  fastify: KubeFastifyInstance,
): Promise<ConsoleApplication[]> => {
  const customObjectsApi = fastify.kube.customObjectsApi;
  const namespace = fastify.kube.namespace;

  let consoleApplications: ConsoleApplication[];
  try {
    const res = await customObjectsApi.listNamespacedCustomObject(
      'applications.console.openshift.io',
      'v1alpha1',
      namespace,
      'consoleapplications',
    );
    const cas = (res?.body as { items: [] })?.items;
    if (cas?.length) {
      consoleApplications = cas.reduce((acc, ca) => {
        acc.push(ca);
        return acc;
      }, []);
    }
  } catch (e) {
    fastify.log.error(e, 'failed to get consoleapplications');
    const error = createError(500, 'failed to get consoleapplications');
    error.explicitInternalServerError = true;
    error.error = 'failed to get consoleapplications';
    error.message =
      'Unable to get ConsoleApplication resources. Please ensure the Open Data Hub operator has been installed.';
    throw error;
  }
  return Promise.resolve(consoleApplications);
};

const fetchConsoleDocuments = async (fastify: KubeFastifyInstance): Promise<ConsoleDocument[]> => {
  const customObjectsApi = fastify.kube.customObjectsApi;
  const namespace = fastify.kube.namespace;

  let consoleDocuments: ConsoleDocument[];
  try {
    const res = await customObjectsApi.listNamespacedCustomObject(
      'documents.console.openshift.io',
      'v1alpha1',
      namespace,
      'consoledocuments',
    );
    const cas = (res?.body as { items: [] })?.items;
    if (cas?.length) {
      consoleDocuments = cas.reduce((acc, cd) => {
        acc.push(cd);
        return acc;
      }, []);
    }
  } catch (e) {
    fastify.log.error(e, 'failed to get consoledocuments');
    const error = createError(500, 'failed to get consoledocuments');
    error.explicitInternalServerError = true;
    error.error = 'failed to get consoledocuments';
    error.message =
      'Unable to get ConsoleDocument resources. Please ensure the Open Data Hub operator has been installed.';
    throw error;
  }
  return Promise.resolve(consoleDocuments);
};

export const initializeWatchedResources = (fastify: KubeFastifyInstance): void => {
  operatorWatcher = new ResourceWatcher<CSVKind>(fastify, fetchInstalledOperators);
  serviceWatcher = new ResourceWatcher<K8sResourceCommon>(fastify, fetchServices);
  kfDefWatcher = new ResourceWatcher<KfDefApplication>(fastify, fetchInstalledKfdefs);
  appWatcher = new ResourceWatcher<ConsoleApplication>(fastify, fetchConsoleApplications);
  docWatcher = new ResourceWatcher<ConsoleDocument>(fastify, fetchConsoleDocuments);
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

export const getApplicationDefs = (): ConsoleApplication[] => {
  return appWatcher.getResources();
};

export const getApplicationDef = (appName: string): ConsoleApplication => {
  const appDefs = getApplicationDefs();
  return appDefs.find((appDef) => appDef.metadata.name === appName);
};

export const getDocs = (): ConsoleDocument[] => {
  return docWatcher.getResources();
};
