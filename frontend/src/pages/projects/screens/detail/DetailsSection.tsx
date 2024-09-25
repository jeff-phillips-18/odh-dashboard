import * as React from 'react';
import classNames from 'classnames';
import {
  Alert,
  Bullseye,
  Flex,
  FlexItem,
  PageSection,
  Spinner,
  Stack,
  StackItem,
  Text,
  TextContent,
  Title,
} from '@patternfly/react-core';
import { ProjectObjectType } from '~/concepts/design/utils';
import HeaderIcon from '~/concepts/design/HeaderIcon';
import ProjectSelectorNavigator from '~/concepts/projects/ProjectSelectorNavigator';
import { ProjectSectionID } from './types';

type DetailsSectionProps = {
  id: ProjectSectionID;
  actions?: React.ReactNode[];
  objectType?: ProjectObjectType;
  title?: string;
  description?: string;
  popover?: React.ReactNode;
  isLoading: boolean;
  loadError?: Error;
  isEmpty: boolean;
  emptyState: React.ReactNode;
  getRedirectPath: (namespace: string) => string;
  children: React.ReactNode;
  labels?: React.ReactNode[];
  showDivider?: boolean;
};

const DetailsSection: React.FC<DetailsSectionProps> = ({
  actions,
  objectType,
  children,
  emptyState,
  getRedirectPath,
  id,
  isEmpty,
  isLoading,
  loadError,
  title,
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
    <PageSection aria-label="details-section" variant="light" id={id}>
      <Stack
        data-testid={`section-${id}`}
        hasGutter
        className={classNames({
          'odh-details-section--divide': !loadError && (isLoading || isEmpty || showDivider),
        })}
      >
        <StackItem>
          <ProjectSelectorNavigator
            getRedirectPath={getRedirectPath}
            showTitle
            invalidDropdownPlaceholder="Select project"
          />
        </StackItem>
        <StackItem>
          <Flex
            direction={{ default: 'column', md: 'row' }}
            gap={{ default: 'gapMd' }}
            alignItems={{ md: 'alignItemsCenter' }}
          >
            <Flex flex={{ default: 'flex_1' }}>
              <FlexItem>
                <Flex
                  direction={{ default: 'row' }}
                  gap={{ default: 'gapSm' }}
                  alignItems={{ default: 'alignItemsCenter' }}
                >
                  {objectType ? (
                    <FlexItem>
                      <HeaderIcon type={objectType} />
                    </FlexItem>
                  ) : null}
                  {title ? (
                    <FlexItem>
                      <Title id={`${id}-title`} headingLevel="h2" size="xl">
                        {title}
                      </Title>
                    </FlexItem>
                  ) : null}
                  {popover ? <FlexItem>{popover}</FlexItem> : null}
                </Flex>
              </FlexItem>
              <FlexItem>
                <TextContent>{description && <Text component="p">{description}</Text>}</TextContent>
              </FlexItem>
            </Flex>
            {!isEmpty ? (
              <Flex direction={{ default: 'column', md: 'row' }}>
                {actions && (
                  <Flex direction={{ default: 'row' }} spaceItems={{ default: 'spaceItemsSm' }}>
                    {actions.map((action, index) => (
                      <FlexItem data-testid="details-section-action" key={index}>
                        {action}
                      </FlexItem>
                    ))}
                  </Flex>
                )}
                {labels && <FlexItem align={{ default: 'alignRight' }}>{labels}</FlexItem>}
              </Flex>
            ) : null}
          </Flex>
        </StackItem>
        {renderContent()}
      </Stack>
    </PageSection>
  );
};

export default DetailsSection;
