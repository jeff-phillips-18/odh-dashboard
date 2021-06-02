import { DEV_MODE, API_PORT } from './const';
import { ODHApp } from '../types';

const getBackendURL = (path: string): string => {
  if (!DEV_MODE) {
    return path;
  }
  return `${window.location.protocol}//${window.location.hostname}:${API_PORT}${path}`;
};

const isRedHatSupported = (app: ODHApp): boolean => {
  const support = (app.spec.support || '').toLowerCase();
  return support === 'red hat' || support === 'redhat';
};

const makeCardVisible = (id: string): void => {
  setTimeout(() => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ block: 'nearest' });
    }
  }, 100);
};

const getDuration = (minutes = 0): string => {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  const hoursString = hours > 0 ? `${hours} ${hours > 1 ? 'hours' : 'hour'} ` : '';
  if (hours > 0) {
    return `${hoursString}${mins > 0 ? ' +' : ''}`;
  }

  return mins > 0 ? `${mins} ${mins > 1 ? 'minutes' : 'minute'}` : '';
};

export const calculateRelativeTime = (startTime: Date, endTime: Date): string => {
  const start = startTime.getTime();
  const end = endTime.getTime();

  const secondsAgo = (end - start) / 1000;
  const minutesAgo = secondsAgo / 60;
  const hoursAgo = minutesAgo / 60;

  if (minutesAgo > 90) {
    const count = Math.round(hoursAgo);
    return `about ${count} hours ago`;
  }
  if (minutesAgo > 45) {
    return 'about an hour ago';
  }
  if (secondsAgo > 90) {
    const count = Math.round(minutesAgo);
    return `about ${count} minutes ago`;
  }
  if (secondsAgo > 45) {
    return 'about a minute ago';
  }
  return 'a few seconds ago';
};

export { getBackendURL, isRedHatSupported, makeCardVisible, getDuration };
