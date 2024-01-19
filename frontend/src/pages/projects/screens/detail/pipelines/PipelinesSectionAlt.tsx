import * as React from 'react';
import { Badge, ButtonVariant, Popover } from '@patternfly/react-core';
import { ProjectSectionID } from '~/pages/projects/screens/detail/types';
import { AccessReviewResource, ProjectSectionTitles } from '~/pages/projects/screens/detail/const';
import {
  CreatePipelineServerButton,
  PipelineServerTimedOut,
  usePipelinesAPI,
} from '~/concepts/pipelines/context';
import ImportPipelineButton from '~/concepts/pipelines/content/import/ImportPipelineButton';
import PipelinesList from '~/pages/projects/screens/detail/pipelines/PipelinesList';
import PipelineServerActions from '~/concepts/pipelines/content/pipelinesDetails/pipeline/PipelineServerActions';
import emptyStateImg from '~/images/empty-state-pipelines.svg';
import { useAccessReview } from '~/api';
import { ProjectDetailsContext } from '~/pages/projects/ProjectDetailsContext';
import DetailsSectionAlt from '~/pages/projects/screens/detail/DetailsSectionAlt';
import { OutlinedQuestionCircleIcon } from "@patternfly/react-icons";
import DashboardPopupIconButton from "~/concepts/dashboard/DashboardPopupIconButton";
import EmptyDetailsView from '~/pages/projects/screens/detail/EmptyDetailsView';

const PipelinesSectionAlt: React.FC = () => {
  const { currentProject } = React.useContext(ProjectDetailsContext);
  const {
    apiAvailable,
    pipelinesServer: { initializing, installed, timedOut },
  } = usePipelinesAPI();

  const [isPipelinesEmpty, setIsPipelinesEmpty] = React.useState(false);
  const [allowCreate, rbacLoaded] = useAccessReview({
    ...AccessReviewResource,
    namespace: currentProject.metadata.name,
  });

  let icon;

  icon = (
    <img
      style={{
        marginLeft: 'var(--pf-v5-global--spacer--xs)',
        marginRight: 'var(--pf-v5-global--spacer--xs)',
        verticalAlign: 'middle',
      }}
      src="../images/UI_icon-Red_Hat-Branch-RGB.svg"
      alt="Pipelines branch icon"
    />
  );

  return (
    <>
      <DetailsSectionAlt
        id={ProjectSectionID.PIPELINES}
        icon={!!installed && icon}
        title={!!installed && ProjectSectionTitles[ProjectSectionID.PIPELINES]}
        popover={!!installed &&
          <Popover
            headerContent={'About pipelines'}
            bodyContent={
              'Standardize and automate machine learning workflows to enable you to further enchance and deploy your data science models.'
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
        badge={!!installed && <Badge>{}</Badge>}
        actions={[
          <ImportPipelineButton
            isDisabled={!installed}
            key={`action-${ProjectSectionID.PIPELINES}`}
            variant="primary"
          />,
          <PipelineServerActions
            key={`action-${ProjectSectionID.PIPELINES}-1`}
            isDisabled={!initializing && !installed}
            variant="kebab"
          />,
        ]}
        isLoading={(!apiAvailable && installed) || initializing}
        isEmpty={!installed}
        emptyState={
          <EmptyDetailsView
            title="Start by configuring a pipeline server"
            description="Standardize and automate machine learning workflows to enable you to further enhance and deploy your data science models."
            iconImage={emptyStateImg}
            allowCreate={rbacLoaded && allowCreate}
            createButton={<CreatePipelineServerButton variant={ButtonVariant.primary} />}
          />
        }
        showDivider={isPipelinesEmpty}
      >
        {timedOut ? (
          <PipelineServerTimedOut />
        ) : (
          <>{installed ? <PipelinesList setIsPipelinesEmpty={setIsPipelinesEmpty} /> : null}</>
        )}
      </DetailsSectionAlt>
    </>
  );
};

export default PipelinesSectionAlt;
