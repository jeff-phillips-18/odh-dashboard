import * as React from 'react';
import { useNavigate } from 'react-router-dom';
import { Content } from '@patternfly/react-core';
import { useAccessReview } from '~/api';
import { AccessReviewResourceAttributes } from '~/k8sTypes';
import { SupportedArea, useIsAreaAvailable } from '~/concepts/areas';
import {
  ProjectObjectType,
  SectionType,
  sectionTypeBorderColor,
  typedObjectImage,
} from '~/concepts/design/utils';
import CollapsibleSection from '~/concepts/design/CollapsibleSection';
import DividedGallery from '~/concepts/design/DividedGallery';
import InfoGalleryItem from '~/concepts/design/InfoGalleryItem';
import { ProjectSectionID } from '~/pages/projects/screens/detail/types';
import { ProjectDetailsContext } from '~/pages/projects/ProjectDetailsContext';
import useConnectionTypesEnabled from '~/concepts/connectionTypes/useConnectionTypesEnabled';

const accessReviewResource: AccessReviewResourceAttributes = {
  group: 'rbac.authorization.k8s.io',
  resource: 'rolebindings',
  verb: 'create',
};

const ConfigurationSection: React.FC = () => {
  const navigate = useNavigate();
  const [open, setOpen] = React.useState<boolean>(true);
  const { currentProject } = React.useContext(ProjectDetailsContext);
  const projectSharingEnabled = useIsAreaAvailable(SupportedArea.DS_PROJECTS_PERMISSIONS).status;
  const connectionTypesEnabled = useConnectionTypesEnabled();
  const [allowCreate, rbacLoaded] = useAccessReview({
    ...accessReviewResource,
    namespace: currentProject.metadata.name,
  });

  const showPermissions = projectSharingEnabled && rbacLoaded && allowCreate;

  return (
    <CollapsibleSection
      title="Project configuration"
      data-testid="section-config"
      open={open}
      setOpen={setOpen}
      showChildrenWhenClosed
    >
      <DividedGallery
        minSize="225px"
        itemCount={showPermissions ? 3 : 2}
        style={{
          borderRadius: 16,
          border: `1px solid ${sectionTypeBorderColor(SectionType.setup)}`,
        }}
      >
        <InfoGalleryItem
          sectionType={SectionType.setup}
          imgSrc={typedObjectImage(ProjectObjectType.clusterStorage)}
          title="Cluster storage"
          description={
            <Content>
              <Content component="small">
                To save your project data, you can add cluster storage and optionally connect the
                storage to a workbench.
              </Content>
            </Content>
          }
          isOpen={open}
          onClick={() =>
            navigate(
              `/projects/${currentProject.metadata.name}?section=${ProjectSectionID.CLUSTER_STORAGES}`,
            )
          }
        />
        {connectionTypesEnabled ? (
          <InfoGalleryItem
            sectionType={SectionType.setup}
            imgSrc={typedObjectImage(ProjectObjectType.dataConnection)}
            title="Connections"
            description={
              <Content component="small">
                Connections enable you to store and retrieve information that typically should not
                be stored in code. For example, you can store details (including credentials) for
                object storage, databases, and more. You can then attach the connections to
                artifacts in your project, such as workbenches and model servers.
              </Content>
            }
            isOpen={open}
            onClick={() =>
              navigate(
                `/projects/${currentProject.metadata.name}?section=${ProjectSectionID.CONNECTIONS}`,
              )
            }
          />
        ) : (
          <InfoGalleryItem
            sectionType={SectionType.setup}
            imgSrc={typedObjectImage(ProjectObjectType.dataConnection)}
            title="Data connections"
            description={
              <Content component="small">
                You can add data connections to workbenches to connect your project to data inputs
                and object storage buckets. You can also use data connections to specify the
                location of your models during deployment.
              </Content>
            }
            isOpen={open}
            onClick={() =>
              navigate(
                `/projects/${currentProject.metadata.name}?section=${ProjectSectionID.DATA_CONNECTIONS}`,
              )
            }
          />
        )}
        {showPermissions ? (
          <InfoGalleryItem
            sectionType={SectionType.setup}
            title="Permissions"
            imgSrc={typedObjectImage(ProjectObjectType.group)}
            description={
              <Content>
                <Content component="small">
                  Add users and groups to share access to your project.
                </Content>
              </Content>
            }
            isOpen={open}
            onClick={() =>
              navigate(
                `/projects/${currentProject.metadata.name}?section=${ProjectSectionID.PERMISSIONS}`,
              )
            }
          />
        ) : null}
      </DividedGallery>
    </CollapsibleSection>
  );
};

export default ConfigurationSection;
