import * as React from 'react';

export enum Actions {
  GET_USER_PENDING = 'GET_USER_PENDING',
  GET_USER_FULFILLED = 'GET_USER_FULFILLED',
  GET_USER_REJECTED = 'GET_USER_REJECTED',
  ADD_NOTIFICATION = 'ADD_NOTIFICATION',
  HIDE_NOTIFICATION = 'HIDE_NOTIFICATION',
  REMOVE_NOTIFICATION = 'REMOVE_NOTIFICATION',
  FORCE_COMPONENTS_UPDATE = 'FORCE_COMPONENTS_UPDATE',
}

export interface AppNotification {
  id?: number;
  status: string;
  title: React.ReactNode;
  message?: React.ReactNode;
  hidden?: boolean;
}

export interface GetUserAction {
  type: string;
  payload: {
    user?: string;
    error?: Error | null;
    notification?: AppNotification;
  };
}

export interface AppState {
  user?: string;
  userLoading: boolean;
  userError?: Error | null;
  notifications: AppNotification[];
  forceComponentsUpdate: number;
}

export interface State {
  appState: AppState;
}
