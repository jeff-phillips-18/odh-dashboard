import * as React from 'react';
import { ConnectedIcon } from '@patternfly/react-icons';
import ManageDataConnectionModal from '~/pages/projects/screens/detail/data-connections/ManageDataConnectionModal';
import { ProjectDetailsContext } from '~/pages/projects/ProjectDetailsContext';
import OverviewCard from './OverviewCard';
import ComponentsCard from "../ComponentsCard";

type DataConnectionCardProps = {
  allowCreate: boolean;
};
const DataConnectionCard: React.FC<DataConnectionCardProps> = ({ allowCreate }) => {
  const {
    dataConnections: { data: dataConnections, loaded, error },
    refreshAllProjectData,
  } = React.useContext(ProjectDetailsContext);
  const [open, setOpen] = React.useState(false);

  const [allowCreate, rbacLoaded] = useAccessReview({
    ...AccessReviewResource,
    namespace: currentProject.metadata.name,
  });

  return (
    <>
      <ComponentsCard
        loading={!loaded}
        loadError={error}
        count={dataConnections.length}
        description="Adding a data connection to your project allows you to connect data inputs to your workbenches"
        allowCreate={allowCreate}
        onAction={() => setOpen(true)}
        createText="Add data connection"
        typeModifier="data-connections"
        navSection="data-connections"
      />
      <ManageDataConnectionModal
        isOpen={open}
        onClose={(submitted) => {
          if (submitted) {
            refreshAllProjectData();
          }
          setOpen(false);
        }}
      />
    </>
  );
};

export default DataConnectionCard;
