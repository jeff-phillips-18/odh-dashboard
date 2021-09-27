import axios from 'axios';
import { getBackendURL } from '../utilities/utils';
import { ConsoleLinkKind } from '../types';
const clusterVersionPath = '/apis/config.openshift.io/v1/clusterversions/version';

export const fetchConsoleLinks = (apiServer: string): Promise<ConsoleLinkKind[]> => {
  // const url = getBackendURL('/api/console-links');
  console.log(apiServer);
  const url = `${apiServer}${clusterVersionPath}`;
  return axios
    .get(url)
    .then((response) => {
      console.dir(response);
      return response.data;
    })
    .catch((e) => {
      throw new Error(e.response.data.message);
    });
};
