import * as React from 'react';
import { Badge, Button, Popover } from '@patternfly/react-core';
import EmptyDetailsList from '~/pages/projects/screens/detail/EmptyDetailsList';
import { ProjectSectionID } from '~/pages/projects/screens/detail/types';
import { AccessReviewResource, ProjectSectionTitles } from '~/pages/projects/screens/detail/const';
import { ProjectDetailsContext } from '~/pages/projects/ProjectDetailsContext';
import { useAccessReview } from '~/api';
import emptyStateImg from '~/images/empty-state-cluster-storage.svg';
import DetailsSectionAlt from '~/pages/projects/screens/detail/DetailsSectionAlt';
import StorageTable from './StorageTable';
import ManageStorageModal from './ManageStorageModal';
import { OutlinedQuestionCircleIcon } from '@patternfly/react-icons';
import DashboardPopupIconButton from '~/concepts/dashboard/DashboardPopupIconButton';

const StorageListAlt: React.FC = () => {
  const [isOpen, setOpen] = React.useState(false);
  const {
    currentProject,
    pvcs: { data: pvcs, loaded, error: loadError },
    refreshAllProjectData: refresh,
  } = React.useContext(ProjectDetailsContext);
  const [allowCreate, rbacLoaded] = useAccessReview({
    ...AccessReviewResource,
    namespace: currentProject.metadata.name,
  });

  const isPvcsEmpty = pvcs.length === 0;

  let icon;

  icon = (
    <img
      style={{
        marginLeft: 'var(--pf-v5-global--spacer--xs)',
        marginRight: 'var(--pf-v5-global--spacer--xs)',
        verticalAlign: 'middle',
      }}
      src="../images/UI_icon-Red_Hat-Storage-RGB.svg"
      alt="Storage icon"
    />
  );

  return (
    <>
      <DetailsSectionAlt
        id={ProjectSectionID.CLUSTER_STORAGES}
        icon={icon}
        title={ProjectSectionTitles[ProjectSectionID.CLUSTER_STORAGES] || ''}
        badge={
          <Badge style={{ marginLeft: 'var(--pf-v5-global--spacer--sm)' }}>{pvcs.length}</Badge>
        }
        popover={
          <Popover
            headerContent={'About cluster storage'}
            bodyContent={
              'For data science projects that require data to be retained, you can add cluster storage to the project.'
            }
          >
            <DashboardPopupIconButton
              icon={
                <OutlinedQuestionCircleIcon
                  style={{ marginLeft: 'var(--pf-v5-global--spacer--md)' }}
                />
              }
              aria-label="More info"
            />
          </Popover>
        }
        actions={[
          <Button
            onClick={() => setOpen(true)}
            key={`action-${ProjectSectionID.CLUSTER_STORAGES}`}
            variant="primary"
          >
            Add cluster storage
          </Button>,
        ]}
        isLoading={!loaded}
        isEmpty={isPvcsEmpty}
        loadError={loadError}
        emptyState={
          <EmptyDetailsList
            title="Start by adding cluster storage"
            description="For data science projects that require data to be retained, you can add cluster storage to the project."
            icon={() => (
              <img style={{ height: '320px' }} src={emptyStateImg} alt="Cluster storage" />
            )}
            actions={
              rbacLoaded && allowCreate ? (
                <Button
                  onClick={() => setOpen(true)}
                  key={`action-${ProjectSectionID.CLUSTER_STORAGES}`}
                  variant="primary"
                >
                  Add cluster storage
                </Button>
              ) : null
            }
          />
        }
      >
        {!isPvcsEmpty ? (
          <StorageTable pvcs={pvcs} refresh={refresh} onAddPVC={() => setOpen(true)} />
        ) : null}
      </DetailsSectionAlt>
      <ManageStorageModal
        isOpen={isOpen}
        onClose={(submit: boolean) => {
          setOpen(false);
          if (submit) {
            refresh();
          }
        }}
      />
    </>
  );
};

export default StorageListAlt;
