import * as React from 'react';
import emptyStateImg from '~/images/UI_icon-Red_Hat-Storage-RGB.svg';
import ManageStorageModal from '~/pages/projects/screens/detail/storage/ManageStorageModal';
import { ProjectDetailsContext } from '~/pages/projects/ProjectDetailsContext';
import OverviewCard from './OverviewCard';

type ClusterStorageCardProps = {
  allowCreate: boolean;
};

const ClusterStorageCard: React.FC<ClusterStorageCardProps> = ({ allowCreate }) => {
  const {
    pvcs: { data: pvcs, loaded, error, refresh },
  } = React.useContext(ProjectDetailsContext);
  const [isOpen, setOpen] = React.useState(false);

  return (
    <>
      <OverviewCard
        loading={!loaded}
        loadError={error}
        count={pvcs.length}
        description="For data science projects that require data to be retained, you can add cluster storage to the project"
        allowCreate={allowCreate}
        onAction={() => setOpen(true)}
        createText="Add cluster storage"
        typeModifier="cluster-storage"
        navSection="cluster-storage"
      />
      <ManageStorageModal
        isOpen={isOpen}
        onClose={(submit: boolean) => {
          setOpen(false);
          if (submit) {
            refresh();
          }
        }}
      />
    </>
  );
};

export default ClusterStorageCard;
