import * as React from 'react';
import { PageSection, Text, TextContent, TextVariants } from '@patternfly/react-core';
import { useNavigate } from 'react-router-dom';
import CollapsibleSection from '~/concepts/design/CollapsibleSection';
import { ProjectObjectType, SectionType, sectionTypeBorderColor } from '~/concepts/design/utils';
import DividedGallery from '~/concepts/design/DividedGallery';
import { useUser } from '~/redux/selectors';
import InfoGalleryItem from '~/concepts/design/InfoGalleryItem';
import { useBrowserStorage } from '~/components/browserStorage';
import { SupportedArea } from '~/concepts/areas';
import useIsAreaAvailable from '~/concepts/areas/useIsAreaAvailable';
import { fireLinkTrackingEvent } from '~/concepts/analyticsTracking/segmentIOUtils';

export const useEnableTeamSection = (): React.ReactNode => {
  const navigate = useNavigate();
  const [resourcesOpen, setResourcesOpen] = useBrowserStorage<boolean>(
    'odh.home.admin.open',
    true,
    true,
    false,
  );
  const { isAdmin } = useUser();
  const { status: notebooksAvailable } = useIsAreaAvailable(SupportedArea.BYON);
  const { status: servingRuntimesAvailable } = useIsAreaAvailable(SupportedArea.CUSTOM_RUNTIMES);
  const { status: clusterSettingsAvailable } = useIsAreaAvailable(SupportedArea.CLUSTER_SETTINGS);
  const { status: userManagementAvailable } = useIsAreaAvailable(SupportedArea.USER_MANAGEMENT);

  if (!isAdmin) {
    return null;
  }

  const trackAndNavigate = (section: string, to: string): void => {
    fireLinkTrackingEvent('HomeCardClicked', {
      to: `${to}`,
      type: 'enableTeam',
      section: `${section}`,
    });
    navigate(to);
  };

  const infoItems = [];

  if (notebooksAvailable) {
    infoItems.push(
      <InfoGalleryItem
        key="notebook-images"
        testId="landing-page-admin--notebook-images"
        isOpen={resourcesOpen}
        title="Notebook images"
        onClick={() => trackAndNavigate('notebook-images', '/notebookImages')}
        resourceType={ProjectObjectType.notebookImage}
        sectionType={SectionType.setup}
        description={
          <TextContent>
            <Text component="small">
              These are instances of your development and experimentation environment. They
              typically contain IDEs, such as JupyterLab, RStudio, and Visual Studio Code.
            </Text>
          </TextContent>
        }
      />,
    );
  }
  if (servingRuntimesAvailable) {
    infoItems.push(
      <InfoGalleryItem
        key="serving-runtimes"
        testId="landing-page-admin--serving-runtimes"
        isOpen={resourcesOpen}
        title="Serving runtimes"
        onClick={() => trackAndNavigate('serving-runtimes', '/servingRuntimes')}
        resourceType={ProjectObjectType.servingRuntime}
        sectionType={SectionType.setup}
        description={
          <TextContent>
            <Text component="small">
              A model-serving runtime adds support for a specified set of model frameworks. You can
              use a default serving runtime, or add and enable a custom serving runtime.
            </Text>
          </TextContent>
        }
      />,
    );
  }
  if (clusterSettingsAvailable) {
    infoItems.push(
      <InfoGalleryItem
        key="cluster-settings"
        testId="landing-page-admin--cluster-settings"
        isOpen={resourcesOpen}
        title="Cluster settings"
        onClick={() => trackAndNavigate('cluster-settings', '/clusterSettings')}
        resourceType={ProjectObjectType.clusterSettings}
        sectionType={SectionType.setup}
        description={
          <TextContent>
            <Text component="small">
              You can change the default size of the cluster’s persistent volume claim (PVC)
              ensuring that the storage requested matches your common storage workflow.
            </Text>
          </TextContent>
        }
      />,
    );
  }
  if (userManagementAvailable) {
    infoItems.push(
      <InfoGalleryItem
        key="user-management"
        testId="landing-page-admin--user-management"
        isOpen={resourcesOpen}
        title="User management"
        onClick={() => trackAndNavigate('user-management', '/groupSettings')}
        resourceType={ProjectObjectType.user}
        sectionType={SectionType.setup}
        description={
          <TextContent>
            <Text component="small">
              If you plan to restrict access to your instance by defining specialized user groups,
              you must grant users permission access by adding user accounts to the Red Hat
              OpenShift AI user groups, administrator groups, or both.
            </Text>
          </TextContent>
        }
      />,
    );
  }

  if (!infoItems.length) {
    return null;
  }

  return (
    <PageSection data-testid="landing-page-admin" variant="light">
      <CollapsibleSection
        title="Enable your team"
        titleVariant={TextVariants.h1}
        open={resourcesOpen}
        setOpen={setResourcesOpen}
        showChildrenWhenClosed
      >
        <DividedGallery
          minSize="225px"
          itemCount={infoItems.length}
          style={{
            borderRadius: 16,
            border: `1px solid ${sectionTypeBorderColor(SectionType.setup)}`,
          }}
        >
          {infoItems}
        </DividedGallery>
      </CollapsibleSection>
    </PageSection>
  );
};
