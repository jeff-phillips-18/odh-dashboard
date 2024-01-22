import * as React from 'react';
import { Flex, FlexItem, Popover } from '@patternfly/react-core';
import { OutlinedQuestionCircleIcon } from '@patternfly/react-icons';
import { ProjectSectionID } from '~/pages/projects/screens/detail/types';
import { ProjectSectionTitles } from '~/pages/projects/screens/detail/const';
import DetailsSection from '~/pages/projects/screens/detail/DetailsSection';
import { PipelineServerTimedOut, usePipelinesAPI } from '~/concepts/pipelines/context';
import NoPipelineServer from '~/concepts/pipelines/NoPipelineServer';
import ImportPipelineButton from '~/concepts/pipelines/content/import/ImportPipelineButton';
import PipelinesList from '~/pages/projects/screens/detail/pipelines/PipelinesList';
import PipelineServerActions from '~/concepts/pipelines/content/pipelinesDetails/pipeline/PipelineServerActions';
import DashboardPopupIconButton from '~/concepts/dashboard/DashboardPopupIconButton';
import EmptyPipelinesSectionCard from './EmptyPipelinesSectionCard';

const PipelinesSection: React.FC = () => {
  const {
    apiAvailable,
    pipelinesServer: { initializing, installed, timedOut },
  } = usePipelinesAPI();

  const [isPipelinesEmpty, setIsPipelinesEmpty] = React.useState(false);

  const icon = (
    <img
      style={{
        marginLeft: 'var(--pf-v5-global--spacer--xs)',
        marginRight: 'var(--pf-v5-global--spacer--xs)',
        verticalAlign: 'sub',
        width: '32px',
      }}
      src="../images/UI_icon-Red_Hat-Branch-RGB.svg"
      alt="Pipelines branch icon"
    />
  );

  return (
    <>
      <DetailsSection
        icon={icon}
        id={ProjectSectionID.PIPELINES}
        title={ProjectSectionTitles[ProjectSectionID.PIPELINES]}
        popover={ installed ?
          <Popover
            headerContent="About pipelines"
            bodyContent="Standardize and automate machine learning workflows to enable you to further enchance and deploy your data science models."
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
        : undefined}
        actions={
          installed
            ? [
                <ImportPipelineButton
                  isDisabled={!installed}
                  key={`action-${ProjectSectionID.PIPELINES}`}
                  variant="secondary"
                />,
                <PipelineServerActions
                  key={`action-${ProjectSectionID.PIPELINES}-1`}
                  isDisabled={!initializing && !installed}
                  variant="kebab"
                />,
              ]
            : undefined
        }
        isLoading={(!apiAvailable && installed) || initializing}
        isEmpty={!installed}
        emptyState={
          <EmptyPipelinesSectionCard allowCreate />
          // <Flex>
          //   <FlexItem>
          //     <NoPipelineServer variant="secondary" />
          //   </FlexItem>
          // </Flex>
        }
        showDivider={isPipelinesEmpty}
      >
        {timedOut ? (
          <PipelineServerTimedOut />
        ) : (
          <PipelinesList setIsPipelinesEmpty={setIsPipelinesEmpty} />
        )}
      </DetailsSection>
    </>
  );
};

export default PipelinesSection;
