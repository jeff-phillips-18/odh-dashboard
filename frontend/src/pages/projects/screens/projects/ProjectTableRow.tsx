import * as React from 'react';
import {
  Flex,
  FlexItem,
  Label,
  Text,
  TextVariants,
  Timestamp,
  Tooltip,
} from '@patternfly/react-core';
import { ActionsColumn, Td, Tr } from '@patternfly/react-table';
import { KnownLabels, ProjectKind } from '~/k8sTypes';
import useProjectTableRowItems from '~/pages/projects/screens/projects/useProjectTableRowItems';
import useProjectNotebookStates from '~/pages/projects/notebook/useProjectNotebookStates';
import ListNotebookState from '~/pages/projects/notebook/ListNotebookState';
import ResourceNameTooltip from '~/components/ResourceNameTooltip';
import projectIcon from '~/images/project-icon.svg';
import { getProjectOwner } from '~/pages/projects/utils';
import { useAppSelector } from '~/redux/hooks';
import ProjectLink from './ProjectLink';

type ProjectTableRowProps = {
  obj: ProjectKind;
  isRefreshing: boolean;
  setEditData: (data: ProjectKind) => void;
  setDeleteData: (data: ProjectKind) => void;
  rowIndex?: number;
};
const ProjectTableRow: React.FC<ProjectTableRowProps> = ({
  obj: project,
  isRefreshing,
  setEditData,
  setDeleteData,
  rowIndex,
}) => {
  const [notebookStates, loaded, error] = useProjectNotebookStates(project.metadata.name);
  const owner = getProjectOwner(project);
  const alternateUI = useAppSelector((state) => state.alternateUI);

  const item = useProjectTableRowItems(project, isRefreshing, setEditData, setDeleteData);
  return (
    <Tr {...(rowIndex && rowIndex % 2 === 0 && { isStriped: true })}>
      <Td dataLabel="Name">
        <Flex spaceItems={{ default: 'spaceItemsXs' }} alignItems={{ default: 'alignItemsCenter' }}>
          {project.metadata.labels?.[KnownLabels.DASHBOARD_RESOURCE] && (
            <FlexItem style={{ display: 'flex' }}>
              <Tooltip content="Data Science">
                {alternateUI ? (
                  <img style={{ height: '24px' }} src={projectIcon} alt="prioject" />
                ) : (
                  <Label isCompact color="green">
                    DS
                  </Label>
                )}
              </Tooltip>
            </FlexItem>
          )}
          <FlexItem>
            <ResourceNameTooltip resource={project}>
              <ProjectLink project={project} />
            </ResourceNameTooltip>
          </FlexItem>
        </Flex>
        {owner && <Text component={TextVariants.small}>{owner}</Text>}
      </Td>
      <Td dataLabel="Workbench status">
        <ListNotebookState
          notebookStates={notebookStates}
          loaded={loaded}
          error={error}
          namespace={project.metadata.name}
        />
      </Td>
      <Td dataLabel="Created">
        {project.metadata.creationTimestamp ? (
          <Timestamp date={new Date(project.metadata.creationTimestamp)} />
        ) : (
          'Unknown'
        )}
      </Td>
      <Td isActionCell>
        <ActionsColumn items={item} />
      </Td>
    </Tr>
  );
};

export default ProjectTableRow;
