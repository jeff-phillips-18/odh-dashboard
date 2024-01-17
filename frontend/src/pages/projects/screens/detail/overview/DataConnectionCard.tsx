import * as React from 'react';
import { Button } from '@patternfly/react-core';
import { ProjectSectionID } from '~/pages/projects/screens/detail/types';
import ManageDataConnectionModal from '~/pages/projects/screens/detail/data-connections/ManageDataConnectionModal';
import { ProjectDetailsContext } from '~/pages/projects/ProjectDetailsContext';
import OverviewCard from './OverviewCard';
import { ConnectedIcon } from '@patternfly/react-icons';

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
        icon={() => <ConnectedIcon style={{ height: '32px' }} alt="Workbenches" />}
        getStartedAction={
          allowCreate ? (
            <Button
              key={`action-${ProjectSectionID.DATA_CONNECTIONS}`}
              onClick={() => setOpen(true)}
              variant="link"
            >
              Get started
            </Button>
          ) : null
        }
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
