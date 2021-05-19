import createError from 'http-errors';
import {
  RhodsApplication,
  RhodsDocument,
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
let appWatcher: ResourceWatcher<RhodsApplication>;
let docWatcher: ResourceWatcher<RhodsDocument>;
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

const fetchRhodsApplications = async (
  fastify: KubeFastifyInstance,
): Promise<RhodsApplication[]> => {
  const customObjectsApi = fastify.kube.customObjectsApi;
  const namespace = fastify.kube.namespace;

  let rhodsApplications: RhodsApplication[];
  let rhodsApplicationMap = new Map();

  try {
    const res = await customObjectsApi.listNamespacedCustomObject(
      'applications.console.openshift.io',
      'v1alpha1',
      namespace,
      'rhodsapplications',
    );
    const cas = (res?.body as { items: RhodsApplication[] })?.items;
    if (cas?.length) {
      rhodsApplications = cas.reduce((acc, ca) => {
        let name = ca.metadata?.name;
        if ( !rhodsApplicationMap.has(name) ) {
          rhodsApplicationMap.set(name, ca)
          acc.push(ca);
        }
        return acc;
      }, []);
    }
  } catch (e) {
    fastify.log.error(e, 'failed to get rhodsapplications');
    const error = createError(500, 'failed to get rhodsapplications');
    error.explicitInternalServerError = true;
    error.error = 'failed to get rhodsapplications';
    error.message =
      'Unable to get RhodsApplication resources. Please ensure the Open Data Hub operator has been installed.';
    throw error;
  }
  return Promise.resolve(rhodsApplications);
};

const fetchRhodsDocuments = async (fastify: KubeFastifyInstance): Promise<RhodsDocument[]> => {
  const customObjectsApi = fastify.kube.customObjectsApi;
  const namespace = fastify.kube.namespace;

  let rhodsDocuments: RhodsDocument[];
  try {
    const res = await customObjectsApi.listNamespacedCustomObject(
      'documents.console.openshift.io',
      'v1alpha1',
      namespace,
      'rhodsdocuments',
    );
    const cas = (res?.body as { items: [] })?.items;
    if (cas?.length) {
      rhodsDocuments = cas.reduce((acc, cd) => {
        acc.push(cd);
        return acc;
      }, []);
    }
  } catch (e) {
    fastify.log.error(e, 'failed to get rhodsdocuments');
    const error = createError(500, 'failed to get rhodsdocuments');
    error.explicitInternalServerError = true;
    error.error = 'failed to get rhodsdocuments';
    error.message =
      'Unable to get RhodsDocument resources. Please ensure the Open Data Hub operator has been installed.';
    throw error;
  }
  return Promise.resolve(rhodsDocuments);
};

export const initializeWatchedResources = (fastify: KubeFastifyInstance): void => {
  operatorWatcher = new ResourceWatcher<CSVKind>(fastify, fetchInstalledOperators);
  serviceWatcher = new ResourceWatcher<K8sResourceCommon>(fastify, fetchServices);
  kfDefWatcher = new ResourceWatcher<KfDefApplication>(fastify, fetchInstalledKfdefs);
  appWatcher = new ResourceWatcher<RhodsApplication>(fastify, fetchRhodsApplications);
  docWatcher = new ResourceWatcher<RhodsDocument>(fastify, fetchRhodsDocuments);
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

export const getApplicationDefs = (): RhodsApplication[] => {
  return appWatcher.getResources();
};

export const getApplicationDef = (appName: string): RhodsApplication => {
  const appDefs = getApplicationDefs();
  return appDefs.find((appDef) => appDef.metadata.name === appName);
};

export const getDocs = (): RhodsDocument[] => {
  return docWatcher.getResources();
};
