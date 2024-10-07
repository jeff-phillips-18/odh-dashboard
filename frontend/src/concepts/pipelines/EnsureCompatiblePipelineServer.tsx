import * as React from 'react';
import {
  EmptyState,
  EmptyStateVariant,
  Bullseye,
  Spinner,
  EmptyStateActions,
  EmptyStateFooter,
  EmptyStateBody,
  Button,
  ButtonVariant,
} from '@patternfly/react-core';
import { ExclamationTriangleIcon } from '@patternfly/react-icons';
import ExternalLink from '~/components/ExternalLink';
import NoPipelineServer from '~/concepts/pipelines/NoPipelineServer';
import { DeleteServerModal, usePipelinesAPI } from './context';

const DOCS_LINK =
  'https://docs.redhat.com/en/documentation/red_hat_openshift_ai_self-managed/2.13/html/release_notes/support-removals_relnotes';

type EnsureCompatiblePipelineServerProps = {
  children: React.ReactNode;
};

const EnsureCompatiblePipelineServer: React.FC<EnsureCompatiblePipelineServerProps> = ({
  children,
}) => {
  const { pipelinesServer } = usePipelinesAPI();
  const [isDeleting, setIsDeleting] = React.useState(false);

  if (pipelinesServer.initializing) {
    return (
      <Bullseye>
        <Spinner />
      </Bullseye>
    );
  }

  if (!pipelinesServer.installed) {
    return <NoPipelineServer variant={ButtonVariant.primary} />;
  }

  if (!pipelinesServer.compatible) {
    return (
      <>
        <Bullseye data-testid="incompatible-pipelines-server">
          <EmptyState
            icon={ExclamationTriangleIcon}
            titleText="Pipeline version cannot be rendered"
            variant={EmptyStateVariant.lg}
          >
            <EmptyStateBody>
              <p>
                Rendering of this pipeline version in the UI is no longer supported, but it can
                still be accessed via the API or OpenShift Console. To remove unsupported versions,
                delete this project&apos;s pipeline server and create a new one.
              </p>
              <ExternalLink
                text="Learn more about supported versions and data recovery"
                to={DOCS_LINK}
              />
            </EmptyStateBody>

            <EmptyStateFooter>
              <EmptyStateActions>
                <Button
                  data-testid="delete-pipeline-server-button"
                  variant="primary"
                  onClick={() => setIsDeleting(true)}
                >
                  Delete pipeline server
                </Button>
              </EmptyStateActions>
            </EmptyStateFooter>
          </EmptyState>
        </Bullseye>
        {isDeleting ? <DeleteServerModal onClose={() => setIsDeleting(false)} /> : null}
      </>
    );
  }

  return <>{children}</>;
};

export default EnsureCompatiblePipelineServer;
