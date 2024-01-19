import * as React from 'react';
import classNames from 'classnames';
import {
  Alert,
  Bullseye,
  Divider,
  Flex,
  FlexItem,
  Icon,
  PageSection,
  Popover,
  Spinner,
  Stack,
  StackItem,
  Text,
  TextContent,
  Title,
} from '@patternfly/react-core';
import { ProjectSectionID } from './types';
import { OutlinedQuestionCircleIcon } from '@patternfly/react-icons';
import DashboardPopupIconButton from '~/concepts/dashboard/DashboardPopupIconButton';

type DetailsSectionAltProps = {
  id: ProjectSectionID;
  actions?: React.ReactNode[];
  icon?: React.ReactNode;
  title: string;
  description?: string;
  badge?: React.ReactNode;
  popover?: React.ReactNode;
  isLoading: boolean;
  loadError?: Error;
  isEmpty: boolean;
  emptyState: React.ReactNode;
  children: React.ReactNode;
  labels?: React.ReactNode[];
  showDivider?: boolean;
};

const DetailsSectionAlt: React.FC<DetailsSectionAltProps> = ({
  actions,
  icon,
  children,
  emptyState,
  id,
  isEmpty,
  isLoading,
  loadError,
  title,
  badge,
  description,
  popover,
  labels,
  showDivider,
}) => {
  const renderContent = () => {
    if (loadError) {
      return (
        <Alert variant="danger" isInline title="Loading error">
          {loadError.message}
        </Alert>
      );
    }

    if (isLoading) {
      return (
        <Bullseye style={{ minHeight: 150 }}>
          <Spinner />
        </Bullseye>
      );
    }

    if (isEmpty) {
      return emptyState;
    }

    return children;
  };

  return (
    <Stack
      hasGutter
      className={classNames({
        'odh-details-section--divide': !loadError && (isLoading || isEmpty || showDivider),
      })}
    >
      <StackItem>
        <Flex direction={{ default: 'column', md: 'row' }} gap={{ default: 'gapMd' }}>
          <Flex flex={{ default: 'flex_1' }}>
            <FlexItem>
              <Title id={`${id}-title`} headingLevel="h2" size="xl">
                {icon}
                {title}
                {badge}
                {popover}
              </Title>
              <TextContent>{description && <Text component="p">{description}</Text>}</TextContent>
            </FlexItem>
          </Flex>
          <Flex direction={{ default: 'column', md: 'row' }}>
            {actions && <FlexItem>{actions}</FlexItem>}
            {labels && <FlexItem align={{ default: 'alignRight' }}>{labels}</FlexItem>}
          </Flex>
        </Flex>
      </StackItem>
      {renderContent()}
    </Stack>

  );
};

export default DetailsSectionAlt;
