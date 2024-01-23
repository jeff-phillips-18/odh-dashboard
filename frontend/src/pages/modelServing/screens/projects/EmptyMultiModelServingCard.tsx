import * as React from 'react';
import { ProjectDetailsContext } from '~/pages/projects/ProjectDetailsContext';
import { ServingRuntimePlatform } from '~/types';
import ComponentsCard from '~/pages/projects/screens/detail/ComponentsCard';
import { ProjectsContext } from '~/concepts/projects/ProjectsContext';
import {
  getSortedTemplates,
  getTemplateEnabled,
  getTemplateEnabledForPlatform,
} from '~/pages/modelServing/customServingRuntimes/utils';
import ManageServingRuntimeModal from './ServingRuntimeModal/ManageServingRuntimeModal';

type DataConnectionCardProps = {
  allowCreate: boolean;
};
const EmptyMultiModelServingCard: React.FC<DataConnectionCardProps> = ({ allowCreate }) => {
  const {
    dataConnections: { data: dataConnections, loaded, error },
  } = React.useContext(ProjectDetailsContext);
  const [open, setOpen] = React.useState(false);

  const {
    servingRuntimes: { refresh: refreshServingRuntime },
    servingRuntimeTemplates: { data: templates },
    servingRuntimeTemplateOrder: { data: templateOrder },
    servingRuntimeTemplateDisablement: { data: templateDisablement },
    serverSecrets: { refresh: refreshTokens },
    inferenceServices: { refresh: refreshInferenceServices },
    currentProject,
  } = React.useContext(ProjectDetailsContext);

  const { refresh: refreshAllProjects } = React.useContext(ProjectsContext);
  const templatesSorted = getSortedTemplates(templates, templateOrder);
  const templatesEnabled = templatesSorted.filter((template) =>
    getTemplateEnabled(template, templateDisablement),
  );

  const onSubmit = (submit: boolean) => {
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
