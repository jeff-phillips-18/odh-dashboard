import * as _ from 'lodash';
import ky from 'ky';

export const GET_USER_PENDING = 'GET_USER_PENDING';
export const getUserPending = () => ({
  type: GET_USER_PENDING,
  payload: {},
});

export const GET_USER_FULFILLED = 'GET_USER_FULFILLED';
export const getUserFullfilled = (response) => ({
  type: GET_USER_FULFILLED,
  payload: {
    user: response.kube.currentUser,
  },
});

export const GET_USER_REJECTED = 'GET_USER_REJECTED';
export const getUserRejected = (error) => ({
  type: GET_USER_REJECTED,
  payload: {
    error,
  },
});

export const GET_COMPONENTS_PENDING = 'GET_COMPONENTS_PENDING';
export const getComponentsPending = () => ({
  type: GET_COMPONENTS_PENDING,
  payload: {},
});

export const GET_COMPONENTS_FULFILLED = 'GET_COMPONENTS_FULFILLED';
export const getComponentsFulfilled = (components) => ({
  type: GET_COMPONENTS_FULFILLED,
  payload: {
    components,
  },
});

export const GET_COMPONENTS_REJECTED = 'GET_COMPONENTS_REJECTED';
export const getComponentsRejected = (error) => ({
  type: GET_COMPONENTS_REJECTED,
  payload: {
    error,
  },
});

export const getComponents = (installed: boolean = false) => {
  const url = `/api/components`;
  return async function (dispatch) {
    dispatch(getComponentsPending());
    const searchParams = new URLSearchParams();
    if (installed) {
      searchParams.set('installed', 'true');
    }
    const options = { searchParams };
    try {
      const response = await ky.get(url, options).json();
      dispatch(getComponentsFulfilled(response));
    } catch (e) {
      let componentError;
      if (e instanceof ky.HTTPError) {
        componentError = await e.response.json();
      } else {
        componentError = e;
      }
      console.error(e);
      dispatch(getComponentsRejected(componentError));
    }
  };
};

export const detectUser = () => {
  const url = `${window.location.protocol}//${window.location.hostname}:9010/api/status`;
  return async function (dispatch) {
    dispatch(getUserPending());
    try {
      const response = await ky.get(url, {}).json();
      dispatch(getUserFullfilled(response));
    } catch (e) {
      let userError;
      console.dir(e);
      if (e instanceof ky.HTTPError) {
        userError = await e.response.json();
      } else {
        userError = e;
      }
      console.error(e);
      dispatch(getUserRejected(userError));
    }
  };
};
