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

type EmptyDetailsListProps = {
  variant?: 'xs' | 'sm' | 'lg' | 'xl' | 'full';
  title?: string;
  description?: string;
  icon?: React.ComponentType;
  actions?: React.ReactNode;
  secondaryActions?: React.ReactNode;
};

const EmptyDetailsList: React.FC<EmptyDetailsListProps> = ({
  variant,
  title,
  description,
  icon,
  actions,
  secondaryActions,
}) => (
  <EmptyState isFullHeight variant={variant}>
    {title && (
      <EmptyStateHeader
        titleText={<>{title}</>}
        icon={icon && <EmptyStateIcon icon={icon ?? PlusCircleIcon} />}
        headingLevel="h3"
      />
    )}
    <EmptyStateBody>{description}</EmptyStateBody>
    {actions || secondaryActions ? (
      <EmptyStateFooter>
        {actions ? <EmptyStateActions>{actions}</EmptyStateActions> : null}
        {secondaryActions ? <EmptyStateActions>{secondaryActions}</EmptyStateActions> : null}
      </EmptyStateFooter>
    ) : null}
  </EmptyState>
);

export default EmptyDetailsList;
