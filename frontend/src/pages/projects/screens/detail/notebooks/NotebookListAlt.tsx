import * as React from 'react';
import { Badge, Button, Popover } from '@patternfly/react-core';
import { useNavigate } from 'react-router-dom';
import { ProjectSectionID } from '~/pages/projects/screens/detail/types';
import { AccessReviewResource, ProjectSectionTitles } from '~/pages/projects/screens/detail/const';
import { ProjectDetailsContext } from '~/pages/projects/ProjectDetailsContext';
import { FAST_POLL_INTERVAL } from '~/utilities/const';
import { useAccessReview } from '~/api';
import emptyStateImg from '~/images/empty-state-notebooks.svg';
import DetailsSectionAlt from '~/pages/projects/screens/detail/DetailsSectionAlt';
import EmptyDetailsView from '~/pages/projects/screens/detail/EmptyDetailsView';
import NotebookTable from './NotebookTable';
import { OutlinedQuestionCircleIcon } from '@patternfly/react-icons';
import DashboardPopupIconButton from '~/concepts/dashboard/DashboardPopupIconButton';

const NotebookListAlt: React.FC = () => {
  const {
    currentProject,
    notebooks: { data: notebookStates, loaded, error: loadError, refresh: refreshNotebooks },
    refreshAllProjectData: refresh,
  } = React.useContext(ProjectDetailsContext);
  const navigate = useNavigate();
  const projectName = currentProject.metadata.name;
  const isNotebooksEmpty = notebookStates.length === 0;
  const [allowCreate, rbacLoaded] = useAccessReview({
    ...AccessReviewResource,
    namespace: currentProject.metadata.name,
  });

  React.useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    if (notebookStates.some((notebookState) => notebookState.isStarting)) {
      interval = setInterval(() => refreshNotebooks(), FAST_POLL_INTERVAL);
    }
    return () => clearInterval(interval);
  }, [notebookStates, refreshNotebooks]);

  let icon;

  icon = (
    <img
      style={{
        marginLeft: 'var(--pf-v5-global--spacer--xs)',
        marginRight: 'var(--pf-v5-global--spacer--xs)',
        verticalAlign: 'middle',
      }}
      src="../images/UI_icon-Red_Hat-Wrench-RGB.svg"
      alt="Notebooks icon"
    />
  );

  return (
    <>
      <DetailsSectionAlt
        id={ProjectSectionID.WORKBENCHES}
        icon={!isNotebooksEmpty && icon}
        title={!isNotebooksEmpty && ProjectSectionTitles[ProjectSectionID.WORKBENCHES] || ''}
        badge={!isNotebooksEmpty &&
          <Badge style={{ marginLeft: 'var(--pf-v5-global--spacer--sm)' }}>
            {' '}
            {notebookStates.length}
          </Badge>
        }
        popover={!isNotebooksEmpty &&
          <Popover
            headerContent={'About workbenches'}
            bodyContent={
              'Creating a workbench allows you to add a Jupyter notebook to your project.'
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
        actions={ !isNotebooksEmpty && [
          <Button
            key={`action-${ProjectSectionID.WORKBENCHES}`}
            onClick={() => navigate(`/projects/${projectName}/spawner`)}
            variant="primary"
          >
            Create workbench
          </Button>,
        ]}
        isLoading={!loaded}
        loadError={loadError}
        isEmpty={isNotebooksEmpty}
        emptyState={
          <EmptyDetailsView
            title="Start by creating a workbench"
            description="Creating a workbench allows you to add a Jupyter notebook to your project."
            iconImage={emptyStateImg}
            allowCreate={rbacLoaded && allowCreate}
            createButton={
              <Button
                key={`action-${ProjectSectionID.WORKBENCHES}`}
                onClick={() => navigate(`/projects/${projectName}/spawner`)}
                variant="primary"
              >
                Create workbench
              </Button>
            }
          />
        }
      >
        {!isNotebooksEmpty ? (
          <NotebookTable notebookStates={notebookStates} refresh={refresh} />
        ) : null}
      </DetailsSectionAlt>
    </>
  );
};

export default NotebookListAlt;
