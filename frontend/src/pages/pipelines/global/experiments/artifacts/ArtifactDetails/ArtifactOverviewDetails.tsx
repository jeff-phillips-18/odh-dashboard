import React from 'react';

import {
  Flex,
  FlexItem,
  Stack,
  Title,
  DescriptionList,
  DescriptionListGroup,
  DescriptionListTerm,
  DescriptionListDescription,
  Content,
} from '@patternfly/react-core';

import { Artifact } from '~/third_party/mlmd';
import { ArtifactUriLink } from '~/concepts/pipelines/content/artifacts/ArtifactUriLink';
import { ArtifactPropertyDescriptionList } from './ArtifactPropertyDescriptionList';

interface ArtifactOverviewDetailsProps {
  artifact: Artifact | undefined;
}

export const ArtifactOverviewDetails: React.FC<ArtifactOverviewDetailsProps> = ({ artifact }) => {
  const artifactObject = artifact?.toObject();
  return (
    <Flex
      spaceItems={{ default: 'spaceItems2xl' }}
      direction={{ default: 'column' }}
      className="pf-v6-u-pt-lg pf-v6-u-pb-lg"
    >
      <FlexItem>
        <Stack hasGutter>
          <Title headingLevel="h3">Live system dataset</Title>
          <DescriptionList isHorizontal data-testid="dataset-description-list">
            <DescriptionListGroup>
              {artifact && artifactObject && (
                <>
                  <DescriptionListTerm data-testid="dataset-description-list-URI">
                    URI
                  </DescriptionListTerm>
                  <DescriptionListDescription>
                    <ArtifactUriLink artifact={artifact} />
                  </DescriptionListDescription>
                </>
              )}
            </DescriptionListGroup>
          </DescriptionList>
        </Stack>
      </FlexItem>
      <FlexItem data-testid="artifact-properties-section">
        <Stack hasGutter>
          <Title headingLevel="h3">Properties</Title>
          {artifactObject?.propertiesMap && artifactObject.propertiesMap.length !== 0 ? (
            <ArtifactPropertyDescriptionList
              propertiesMap={artifactObject.propertiesMap}
              testId="props-description-list"
            />
          ) : (
            <Content>
              <Content component="small">No properties</Content>
            </Content>
          )}
        </Stack>
      </FlexItem>
      <FlexItem data-testid="artifact-custom-properties-section">
        <Stack hasGutter>
          <Title headingLevel="h3">Custom properties</Title>
          {artifactObject?.customPropertiesMap &&
          artifactObject.customPropertiesMap.length !== 0 ? (
            <ArtifactPropertyDescriptionList
              propertiesMap={artifactObject.customPropertiesMap}
              testId="custom-props-description-list"
            />
          ) : (
            <Content>
              <Content component="small">No custom properties</Content>
            </Content>
          )}
        </Stack>
      </FlexItem>
    </Flex>
  );
};
