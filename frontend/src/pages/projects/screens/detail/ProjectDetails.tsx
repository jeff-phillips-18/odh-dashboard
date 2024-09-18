import * as React from 'react';
import { Breadcrumb, BreadcrumbItem, Flex, FlexItem } from '@patternfly/react-core';
import { Link } from 'react-router-dom';
import ApplicationsPage from '~/pages/ApplicationsPage';
import { ProjectDetailsContext } from '~/pages/projects/ProjectDetailsContext';
import { typedObjectImage, ProjectObjectType } from '~/concepts/design/utils';
import { getDescriptionFromK8sResource, getDisplayNameFromK8sResource } from '~/concepts/k8s/utils';
import useCheckLogoutParams from './useCheckLogoutParams';
import ProjectOverview from './overview/ProjectOverview';

import './ProjectDetails.scss';

const ProjectDetails: React.FC = () => {
  const { currentProject } = React.useContext(ProjectDetailsContext);
  const displayName = getDisplayNameFromK8sResource(currentProject);
  const description = getDescriptionFromK8sResource(currentProject);

  useCheckLogoutParams();

  return (
    <ApplicationsPage
      title={
        <Flex
          spaceItems={{ default: 'spaceItemsSm' }}
          alignItems={{ default: 'alignItemsFlexStart' }}
        >
          <img style={{ height: 32 }} src={typedObjectImage(ProjectObjectType.project)} alt="" />
          <FlexItem>{displayName}</FlexItem>
        </Flex>
      }
      description={<div style={{ marginLeft: 40 }}>{description}</div>}
      breadcrumb={
        <Breadcrumb>
          <BreadcrumbItem render={() => <Link to="/projects">Projects</Link>} />
          <BreadcrumbItem isActive>{displayName}</BreadcrumbItem>
        </Breadcrumb>
      }
      loaded
      empty={false}
      getRedirectPath={(ns) => `projects/${ns}`}
    >
      <ProjectOverview />
    </ApplicationsPage>
  );
};

export default ProjectDetails;
