import * as React from 'react';
import { ConnectedIcon } from '@patternfly/react-icons';
import ManageDataConnectionModal from '~/pages/projects/screens/detail/data-connections/ManageDataConnectionModal';
import { ProjectDetailsContext } from '~/pages/projects/ProjectDetailsContext';
import OverviewCard from './OverviewCard';

type DataConnectionCardProps = {
  allowCreate: boolean;
};
const DataConnectionCard: React.FC<DataConnectionCardProps> = ({ allowCreate }) => {
  const {
    dataConnections: { data: dataConnections, loaded, error },
    refreshAllProjectData,
  } = React.useContext(ProjectDetailsContext);
  const [open, setOpen] = React.useState(false);

  return (
    <>
      <OverviewCard
        loading={!loaded}
        loadError={error}
        count={dataConnections.length}
        title="Data connections"
        description="Connect data inputs to your workbenches."
        icon={() => (
          <ConnectedIcon
            className="odh-project-overview__card--icon m-data-connection"
            alt="Data connections"
          />
        )}
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