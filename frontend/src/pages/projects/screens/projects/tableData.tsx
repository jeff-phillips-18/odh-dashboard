import { SortableData } from '~/components/table';
import { ProjectKind } from '~/k8sTypes';
import { getProjectCreationTime, getProjectDisplayName } from '~/pages/projects/utils';

export const columns: SortableData<ProjectKind>[] = [
  {
    field: 'name',
    label: 'Name',
    sortable: (a, b) => getProjectDisplayName(a).localeCompare(getProjectDisplayName(b)),
  },
  {
    field: 'notebooks',
    label: 'Workbench status',
    sortable: false,
  },
  {
    field: 'created',
    label: 'Created',
    sortable: (a, b) => getProjectCreationTime(a) - getProjectCreationTime(b),
  },
  {
    field: 'kebab',
    label: '',
    sortable: false,
  },
];
export const columnsAlt: SortableData<ProjectKind>[] = [
  {
    field: 'expand',
    label: '',
    sortable: false,
  },
  {
    field: 'name',
    label: 'Name',
    sortable: (a, b) => getProjectDisplayName(a).localeCompare(getProjectDisplayName(b)),
  },
  {
    field: 'status',
    label: 'Status',
    sortable: true,
  },
  {
    field: 'createdBy',
    label: 'Created by',
    sortable: true,
  },
  {
    field: 'created',
    label: 'Created',
    sortable: (a, b) => getProjectCreationTime(a) - getProjectCreationTime(b),
  },
  {
    field: 'kebab',
    label: '',
    sortable: false,
  },
];
