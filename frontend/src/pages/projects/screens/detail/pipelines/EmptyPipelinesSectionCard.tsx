import * as React from 'react';
import { ConfigurePipelinesServerModal } from '~/concepts/pipelines/content/configurePipelinesServer/ConfigurePipelinesServerModal';
import { PipelinesContext } from '~/concepts/pipelines/context/PipelinesContext';
import usePipelines from '~/concepts/pipelines/apiHooks/usePipelines';
import { LIMIT_MAX_ITEM_COUNT } from '~/concepts/pipelines/const';
import ComponentsCard from '~/pages/projects/screens/detail/ComponentsCard';

type PipelinesCardProps = {
  allowCreate: boolean;
};
const PipelinesCard: React.FC<PipelinesCardProps> = ({ allowCreate }) => {
  const [pipelines, loaded, loadError] = usePipelines(LIMIT_MAX_ITEM_COUNT);

  const [open, setOpen] = React.useState(false);
  const { refreshState } = React.useContext(PipelinesContext);

  return (
    <>
      <ComponentsCard
        loading={!loaded}
        loadError={loadError}
        count={pipelines.length}
        description="Standardize and automate machine learning workflows to enable you to further enchance and deploy your data science models."
        allowCreate={allowCreate}
        onAction={() => setOpen(true)}
        createText="Create pipeline"
        typeModifier="pipeline"
        navSection="pipeline"
      />
      <ConfigurePipelinesServerModal
        open={open}
        onClose={() => {
          setOpen(false);
          refreshState();
        }}
      />
    </>
  );
};

export default PipelinesCard;
