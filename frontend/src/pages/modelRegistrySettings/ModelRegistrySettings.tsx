import React from 'react';
import {
  Button,
  EmptyState,
  EmptyStateActions,
  EmptyStateBody,
  EmptyStateFooter,
  EmptyStateVariant,
} from '@patternfly/react-core';
import { PlusCircleIcon } from '@patternfly/react-icons';
import ApplicationsPage from '~/pages/ApplicationsPage';
import useModelRegistriesBackend from '~/concepts/modelRegistrySettings/useModelRegistriesBackend';
import ModelRegistriesTable from './ModelRegistriesTable';
import CreateModal from './CreateModal';

const ModelRegistrySettings: React.FC = () => {
  const [createModalOpen, setCreateModalOpen] = React.useState(false);
  const [modelRegistries, loaded, loadError, refresh] = useModelRegistriesBackend();
  return (
    <>
      <ApplicationsPage
        title="Model registry settings"
        description="Manage model registry settings for all users in your organization."
        loaded={loaded}
        loadError={loadError}
        errorMessage="Unable to load model registries."
        empty={modelRegistries.length === 0}
        emptyStatePage={
          <EmptyState  headingLevel="h5" icon={PlusCircleIcon}  titleText="No model registries" variant={EmptyStateVariant.lg} data-testid="mr-settings-empty-state">
            <EmptyStateBody>
              To get started, create a model registry. You can manage permissions after creation.
            </EmptyStateBody>
            <EmptyStateFooter>
              <EmptyStateActions>
                <Button variant="primary" onClick={() => setCreateModalOpen(true)}>
                  Create model registry
                </Button>
              </EmptyStateActions>
            </EmptyStateFooter>
          </EmptyState>
        }
        provideChildrenPadding
      >
        <ModelRegistriesTable
          modelRegistries={modelRegistries}
          refresh={refresh}
          onCreateModelRegistryClick={() => setCreateModalOpen(true)}
        />
      </ApplicationsPage>
      <CreateModal
        isOpen={createModalOpen}
        onClose={() => setCreateModalOpen(false)}
        refresh={refresh}
      />
    </>
  );
};

export default ModelRegistrySettings;
