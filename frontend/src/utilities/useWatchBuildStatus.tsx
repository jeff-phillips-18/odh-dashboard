import * as React from 'react';
import { BuildStatus } from '../types';
import { POLL_INTERVAL } from './const';
import { useDeepCompareMemoize } from './useDeepCompareMemoize';
import { fetchBuildStatuses } from '../services/buildsService';

export const useWatchBuildStatus = (): {
  buildStatuses: BuildStatus[];
  loaded: boolean;
  loadError: Error | undefined;
} => {
  const [loaded, setLoaded] = React.useState<boolean>(false);
  const [loadError, setLoadError] = React.useState<Error>();
  const [statuses, setStatuses] = React.useState<BuildStatus[]>([]);

  React.useEffect(() => {
    let watchHandle;
    const watchBuildStatuses = () => {
      fetchBuildStatuses()
        .then((statuses: BuildStatus[]) => {
          statuses.sort((a, b) => a.name.localeCompare(b.name));
          setLoaded(true);
          setLoadError(undefined);
          setStatuses(statuses);
        })
        .catch((e) => {
          setLoadError(e);
        });
      watchHandle = setTimeout(watchBuildStatuses, POLL_INTERVAL);
    };
    watchBuildStatuses();

    return () => {
      if (watchHandle) {
        clearTimeout(watchHandle);
      }
    };
  }, []);

  const retStatuses = useDeepCompareMemoize<BuildStatus[]>(statuses);

  return { buildStatuses: retStatuses || [], loaded, loadError };
};
