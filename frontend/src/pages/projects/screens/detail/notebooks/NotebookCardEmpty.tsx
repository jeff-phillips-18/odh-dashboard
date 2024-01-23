import * as React from 'react';
import { useNavigate } from 'react-router-dom';
import { ProjectDetailsContext } from '~/pages/projects/ProjectDetailsContext';
import ComponentsCard from '~/pages/projects/screens/detail/ComponentsCard';

type NotebookCardProps = {
  allowCreate: boolean;
};

const NotebookCard: React.FC<NotebookCardProps> = ({ allowCreate }) => {
  const navigate = useNavigate();
  const {
    currentProject,
    notebooks: { data: notebooks, loaded, error },
  } = React.useContext(ProjectDetailsContext);

  return (
    <ComponentsCard
      loading={!loaded}
      loadError={error}
      count={notebooks.length}
      allowCreate={allowCreate}
      description="Creating a workbench allows you to add a Jupyter notebook to your project."
      onAction={() => navigate(`/projects/${currentProject.metadata.name}/spawner`)}
      createText="Create workbench"
      typeModifier="notebook"
      navSection="workbenches"
    />
  );
};

export default NotebookCard;
