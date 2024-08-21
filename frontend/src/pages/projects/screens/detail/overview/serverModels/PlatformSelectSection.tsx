import * as React from 'react';
import { Alert, Gallery, Stack, Content } from '@patternfly/react-core';
import CollapsibleSection from '~/concepts/design/CollapsibleSection';
import SelectSingleModelCard from './SelectSingleModelCard';
import SelectMultiModelCard from './SelectMultiModelCard';

const PlatformSelectSection: React.FC = () => (
  <CollapsibleSection title="Serve models" data-testid="section-model-server">
    <Stack hasGutter>
      <Content
        data-testid="no-model-serving-platform-selected"
        style={{ paddingLeft: 'var(--pf-t--global--spacer--md)' }}
      >
        <Content component="small">
          Select the type of model serving platform to be used when deploying models from this
          project.
        </Content>
      </Content>
      <Gallery
        hasGutter
        minWidths={{ default: '100%', lg: 'calc(50% - 1rem / 2)' }}
        maxWidths={{ default: '100%', lg: 'calc(50% - 1rem / 2)' }}
      >
        <SelectSingleModelCard />
        <SelectMultiModelCard />
      </Gallery>
      <Alert
        isInline
        variant="info"
        title="The model serving type can be changed until the first model is deployed from this project. After that, if you want to use a different model serving type, you must create a new project."
      />
    </Stack>
  </CollapsibleSection>
);

export default PlatformSelectSection;
