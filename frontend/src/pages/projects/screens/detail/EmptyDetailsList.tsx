import * as React from 'react';
import {
  EmptyState,
  EmptyStateBody,
  EmptyStateIcon,
  EmptyStateHeader,
  EmptyStateActions,
  EmptyStateFooter,
} from '@patternfly/react-core';
import { PlusCircleIcon } from '@patternfly/react-icons';
import { SVGIconProps } from '@patternfly/react-icons/dist/esm/createIcon';

type EmptyDetailsListProps = {
  title?: string;
  description?: string;
  icon?: React.ComponentClass<SVGIconProps>;
  actions?: React.ReactNode[];
};

const EmptyDetailsList: React.FC<EmptyDetailsListProps> = ({
  title,
  description,
  icon,
  actions,
}) => (
  <EmptyState
    // isFullHeight
    style={{
      border: 'dashed',
      borderColor: 'var(--pf-v5-global--Color--400)',
      borderWidth: '1.5px',
      marginBottom: 'var(--pf-v5-global--spacer--xl)',
    }}
    variant="xs"
  >
    <EmptyStateHeader
      titleText={<>{title}</>}
      icon={icon && <EmptyStateIcon icon={icon ?? PlusCircleIcon} />}
      headingLevel="h3"
    />
    <EmptyStateBody>{description}</EmptyStateBody>
    {actions && (
      <EmptyStateFooter>
        <EmptyStateActions>{actions}</EmptyStateActions>
      </EmptyStateFooter>
    )}
  </EmptyState>
);

export default EmptyDetailsList;
