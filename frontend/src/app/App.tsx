import React from 'react';
import { useDispatch } from 'react-redux';
import '@patternfly/patternfly/patternfly.min.css';
import { Page } from '@patternfly/react-core';
import { addNotification, detectUser } from '../redux/actions/actions';
import { useDesktopWidth } from '../utilities/useDesktopWidth';
import Header from './Header';
import Routes from './Routes';
import NavSidebar from './NavSidebar';
import ToastNotifications from '../components/ToastNotifications';
import AppNotificationDrawer from './AppNotificationDrawer';
import { useWatchBuildStatus } from '../utilities/useWatchBuildStatus';
import { BuildStatus } from '../types';

import './App.scss';

const runningStatuses = ['pending', 'running', 'cancelled'];
const failedStatuses = ['error', 'failed'];

const App: React.FC = () => {
  const isDeskTop = useDesktopWidth();
  const [isNavOpen, setIsNavOpen] = React.useState(isDeskTop);
  const [notificationsOpen, setNotificationsOpen] = React.useState(false);
  const { buildStatuses } = useWatchBuildStatus();
  const prevBuildStatuses = React.useRef<BuildStatus[]>();
  const dispatch = useDispatch();

  React.useEffect(() => {
    dispatch(detectUser());
  }, [dispatch]);

  React.useEffect(() => {
    setIsNavOpen(isDeskTop);
  }, [isDeskTop]);

  const onNavToggle = () => {
    setIsNavOpen(!isNavOpen);
  };

  React.useEffect(() => {
    console.log(`====== BUILD STATUSES =========`);
    console.dir(buildStatuses);
    const wasFailed =
      prevBuildStatuses.current?.filter((buildStatus) =>
        failedStatuses.includes(buildStatus.status.toLowerCase()),
      ) ?? [];
    const wasBuilding =
      prevBuildStatuses.current?.find((buildStatus) =>
        runningStatuses.includes(buildStatus.status?.toLowerCase()),
      ) ?? [];
    const failed = buildStatuses.filter((buildStatus) =>
      failedStatuses.includes(buildStatus.status?.toLowerCase()),
    );
    const building = buildStatuses.find((buildStatus) =>
      runningStatuses.includes(buildStatus.status.toLowerCase()),
    );
    if (failed.length > 0) {
      failed.forEach((buildStatus) => {
        if (!wasFailed.find((failedStatus) => failedStatus.name === buildStatus.name)) {
          dispatch(
            addNotification({
              status: 'danger',
              title: `Notebook image build ${buildStatus.name} failed.`,
              timestamp: new Date(),
            }),
          );
        }
      });
    }
    if (prevBuildStatuses.current && wasBuilding && !building && !failed) {
      dispatch(
        addNotification({
          status: 'success',
          title: 'All notebook images installed.',
          timestamp: new Date(),
        }),
      );
    }

    prevBuildStatuses.current = buildStatuses;
  }, [buildStatuses, dispatch]);

  return (
    <Page
      className="odh-dashboard"
      header={
        <Header
          isNavOpen={isNavOpen}
          onNavToggle={onNavToggle}
          onNotificationsClick={() => setNotificationsOpen(!notificationsOpen)}
        />
      }
      sidebar={<NavSidebar isNavOpen={isNavOpen} />}
      notificationDrawer={<AppNotificationDrawer onClose={() => setNotificationsOpen(false)} />}
      isNotificationDrawerExpanded={notificationsOpen}
    >
      <Routes />
      <ToastNotifications />
    </Page>
  );
};

export default App;
