import * as React from 'react';
import { useSearchParams } from 'react-router-dom';
import userCardImage from '~/images/Icon-Red_Hat-User-Black.jpg';
import groupCardImage from '~/images/Icon-Red_Hat-Shared_workspace-Black.jpg';
import { ProjectDetailsContext } from '~/pages/projects/ProjectDetailsContext';
import { filterRoleBindingSubjects } from '~/pages/projects/projectSharing/utils';
import { ProjectSharingRBType } from '~/pages/projects/projectSharing/types';
import OverviewCard from './OverviewCard';

const UserGroupsCard: React.FC = () => {
  const [queryParams, setQueryParams] = useSearchParams();
  const {
    projectSharingRB: { data: roleBindings, loaded, error },
  } = React.useContext(ProjectDetailsContext);

  const users = filterRoleBindingSubjects(roleBindings, ProjectSharingRBType.USER);
  const groups = filterRoleBindingSubjects(roleBindings, ProjectSharingRBType.GROUP);

  return (
    <div className="odh-project-overview__user-group-card">
      <OverviewCard
        loading={!loaded}
        loadError={error}
        count={users.length}
        title="Users"
        description="Add users to allow access to your project."
        allowCreate={users.length === 0}
        onAction={() => {
          queryParams.set('section', 'permissions');
          setQueryParams(queryParams);
        }}
        imgSrc={userCardImage}
        imgAlt="Users"
        typeModifier="user"
        navSection="permissions"
      />
      <OverviewCard
        loading={!loaded}
        loadError={error}
        count={groups.length}
        title="Groups"
        description="Add groups to allow access to your project."
        allowCreate={groups.length === 0}
        onAction={() => {
          queryParams.set('section', 'permissions');
          setQueryParams(queryParams);
        }}
        imgSrc={groupCardImage}
        imgAlt="Groups"
        typeModifier="group"
        navSection="permissions"
      />
    </div>
  );
};

export default UserGroupsCard;
