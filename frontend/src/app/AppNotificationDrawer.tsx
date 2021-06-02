import { AppNotification, State } from '../redux/types';
import { useDispatch, useSelector } from 'react-redux';
import {
  NotificationDrawer,
  NotificationDrawerHeader,
  NotificationDrawerBody,
  NotificationDrawerList,
  NotificationDrawerListItem,
  NotificationDrawerListItemHeader,
  NotificationDrawerListItemBody,
  EmptyStateVariant,
  EmptyState,
  EmptyStateBody,
} from '@patternfly/react-core';
import React from 'react';
import { ackNotification, removeNotification } from '../redux/actions/actions';
import { Button, ButtonVariant } from '@patternfly/react-core/src/components/Button/index';
import TimesIcon from '@patternfly/react-icons/dist/js/icons/times-icon';

interface AppNotificationDrawerProps {
  onClose: () => void;
}

const AppNotificationDrawer: React.FC<AppNotificationDrawerProps> = ({ onClose }) => {
  const notifications: AppNotification[] = useSelector<State, AppNotification[]>(
    (state) => state.appState.notifications,
  );
  const dispatch = useDispatch();
  const newNotifications = React.useMemo(() => {
    return notifications.filter((notification) => !notification.read).length;
  }, [notifications]);

  const markNotificationRead = (notification: AppNotification): void => {
    dispatch(ackNotification(notification));
  };

  const onRemoveNotification = (notification: AppNotification): void => {
    dispatch(removeNotification(notification));
  };

  console.dir(onClose);
  return (
    <NotificationDrawer>
      <NotificationDrawerHeader count={newNotifications} onClose={onClose}>
      </NotificationDrawerHeader>
      <NotificationDrawerBody>
        {notifications.length ? (
          <NotificationDrawerList>
            {notifications.map((notification) => (
              <NotificationDrawerListItem
                variant={notification.status}
                onClick={() => markNotificationRead(notification)}
                isRead={notification.read}
              >
                <NotificationDrawerListItemHeader
                  variant={notification.status}
                  title={notification.title}
                  srTitle={notification.title}
                >
                  <div>
                    <Button variant={ButtonVariant.plain} aria-label="remove notification" onClick={onRemoveNotification}>
                      <TimesIcon aria-hidden="true" />
                    </Button>
                  </div>
                </NotificationDrawerListItemHeader>
                <NotificationDrawerListItemBody timestamp="5 minutes ago">
                  {notification.message}
                </NotificationDrawerListItemBody>
              </NotificationDrawerListItem>
            ))}
          </NotificationDrawerList>
        ) : (
          <EmptyState variant={EmptyStateVariant.small}>
            <EmptyStateBody>
              There are no notifications at this time.
            </EmptyStateBody>
          </EmptyState>
        )}
      </NotificationDrawerBody>
    </NotificationDrawer>
  );
};

export default AppNotificationDrawer;
