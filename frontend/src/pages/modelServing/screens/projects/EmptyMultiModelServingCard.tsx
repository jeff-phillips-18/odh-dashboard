import * as React from 'react';
import { ConnectedIcon } from '@patternfly/react-icons';
import ManageDataConnectionModal from '~/pages/projects/screens/detail/data-connections/ManageDataConnectionModal';
import { ProjectDetailsContext } from '~/pages/projects/ProjectDetailsContext';
import { ServingRuntimePlatform } from '~/types';
import { getSortedTemplates, getTemplateEnabled, getTemplateEnabledForPlatform } from '../../customServingRuntimes/utils';
import ManageKServeModal from './kServeModal/ManageKServeModal';
import ComponentsCard from '~/pages/projects/screens/detail/ComponentsCard';
import ManageServingRuntimeModal from "./ServingRuntimeModal/ManageServingRuntimeModal";
import { ProjectsContext } from '~/concepts/projects/ProjectsContext';

type DataConnectionCardProps = {
  allowCreate: boolean;
};
const EmptyMultiModelServingCard: React.FC<DataConnectionCardProps> = ({ allowCreate }) => {
  const {
    dataConnections: { data: dataConnections, loaded, error },
    refreshAllProjectData,
  } = React.useContext(ProjectDetailsContext);
  const [open, setOpen] = React.useState(false);

  const {
    servingRuntimes: {
      data: servingRuntimes,
      loaded: servingRuntimesLoaded,
      error: servingRuntimeError,
      refresh: refreshServingRuntime,
    },
    servingRuntimeTemplates: { data: templates, loaded: templatesLoaded, error: templateError },
    servingRuntimeTemplateOrder: { data: templateOrder },
    servingRuntimeTemplateDisablement: { data: templateDisablement },
    serverSecrets: { refresh: refreshTokens },
    inferenceServices: { refresh: refreshInferenceServices },
    currentProject,
  } = React.useContext(ProjectDetailsContext);

  const [platformSelected, setPlatformSelected] = React.useState<
  ServingRuntimePlatform | undefined
>(undefined);

const { refresh: refreshAllProjects } = React.useContext(ProjectsContext);
const templatesSorted = getSortedTemplates(templates, templateOrder);
const templatesEnabled = templatesSorted.filter((template) =>
  getTemplateEnabled(template, templateDisablement),
);


  const onSubmit = (submit: boolean) => {
    setPlatformSelected(undefined);
    if (submit) {
      refreshAllProjects();
      refreshServingRuntime();
      refreshInferenceServices();
      setTimeout(refreshTokens, 500); // need a timeout to wait for tokens creation
    }
  };


  return (
    <>
      <ComponentsCard
        loading={!loaded}
        loadError={error}
        count={dataConnections.length}
        title="Multi-model serving platform"
        description="Multiple models can be deployed from a single model server. Choose this option when you have a large number of small models to deploy that can share server resources."
        allowCreate={allowCreate}
        onAction={() => setOpen(true)}
        createText="Add model server"
        typeModifier="model-server"
        navSection="model-server"
      />
      <ManageServingRuntimeModal
        isOpen={open}
        currentProject={currentProject}
        servingRuntimeTemplates={templatesEnabled.filter((template) =>
          getTemplateEnabledForPlatform(template, ServingRuntimePlatform.MULTI),
        )}
        onClose={(submit: boolean) => {
          setOpen(false);
          onSubmit(submit);
        }}
      />
    </>
  );
};

export default EmptyMultiModelServingCard;
