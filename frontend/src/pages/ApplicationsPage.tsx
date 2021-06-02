import React from 'react';
import { QuestionCircleIcon, WarningTriangleIcon } from '@patternfly/react-icons';
import {
  PageSection,
  PageSectionVariants,
  TextContent,
  Text,
  EmptyState,
  EmptyStateVariant,
  EmptyStateIcon,
  Spinner,
  Title,
  EmptyStateBody,
} from '@patternfly/react-core';
import { useDispatch } from 'react-redux';
import { addNotification } from '../redux/actions/actions';
import { useWatchBuildStatus } from '../utilities/useWatchBuildStatus';
import { BuildStatus } from '../types';

import './ApplicationsPage.scss';

type ApplicationsPageProps = {
  title: string;
  description: string;
  loaded: boolean;
  empty: boolean;
  loadError?: Error;
};

const runningStatuses = ['pending', 'running', 'cancelled'];

const ApplicationsPage: React.FC<ApplicationsPageProps> = ({
  title,
  description,
  loaded,
  empty,
  loadError,
  children,
}) => {
  const { buildStatuses } = useWatchBuildStatus();
  const prevBuildStatuses = React.useRef<BuildStatus[]>();
  const dispatch = useDispatch();

  React.useEffect(() => {
    console.log(`====== BUILD STATUSES =========`);
    console.dir(buildStatuses);
    if (prevBuildStatuses.current) {
      const wasFailed = prevBuildStatuses.current.filter(
        (buildStatus) => buildStatus.status === 'failed',
      );
      const wasBuilding = prevBuildStatuses.current.find((buildStatus) =>
        runningStatuses.includes(buildStatus.status?.toLowerCase()),
      );
      const failed = buildStatuses.filter(
        (buildStatus) => buildStatus.status?.toLowerCase() === 'failed',
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
      if (wasBuilding && !building && !failed) {
        dispatch(
          addNotification({
            status: 'success',
            title: 'All notebook images installed.',
            timestamp: new Date(),
          }),
        );
      }
    }
    prevBuildStatuses.current = buildStatuses;
  }, [buildStatuses, dispatch]);
  const renderContents = () => {
    if (loadError) {
      return (
        <PageSection>
          <EmptyState variant={EmptyStateVariant.full}>
            <EmptyStateIcon icon={WarningTriangleIcon} />
            <Title headingLevel="h5" size="lg">
              Error loading components
            </Title>
            <EmptyStateBody className="odh-dashboard__error-body">
              <div>
                <code className="odh-dashboard__display-error">{loadError.message}</code>
              </div>
            </EmptyStateBody>
          </EmptyState>
        </PageSection>
      );
    }

    if (!loaded) {
      return (
        <PageSection>
          <EmptyState variant={EmptyStateVariant.full}>
            <Spinner size="xl" />
            <Title headingLevel="h5" size="lg">
              Loading
            </Title>
          </EmptyState>
        </PageSection>
      );
    }

    if (empty) {
      return (
        <PageSection>
          <EmptyState variant={EmptyStateVariant.full}>
            <EmptyStateIcon icon={QuestionCircleIcon} />
            <Title headingLevel="h5" size="lg">
              No Components Found
            </Title>
          </EmptyState>
        </PageSection>
      );
    }

    return children;
  };

  return (
    <>
      <PageSection className="odh-apps__heading" variant={PageSectionVariants.light}>
        <TextContent className="odh-apps__heading__text">
          <Text component="h1">{title}</Text>
          <Text component="p">{description}</Text>
        </TextContent>
      </PageSection>
      {renderContents()}
    </>
  );
};

export default ApplicationsPage;
