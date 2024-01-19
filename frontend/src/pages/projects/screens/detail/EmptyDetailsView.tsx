import * as React from 'react';
import {
  EmptyState,
  EmptyStateBody,
  EmptyStateIcon,
  EmptyStateHeader,
  EmptyStateActions,
  EmptyStateFooter,
} from '@patternfly/react-core';

type EmptyDetailsViewProps = {
  title: string;
  description?: string;
  iconImage: string;
  allowCreate: boolean;
  createButton?: React.ReactNode;
};

const EmptyDetailsView: React.FC<EmptyDetailsViewProps> = ({
  title,
  description,
  iconImage,
  allowCreate,
  createButton,
}) => (
  <EmptyState variant="lg">
    <EmptyStateHeader
      titleText={<>{title}</>}
      icon={<EmptyStateIcon icon={() => <img style={{ height: '320px' }} src={iconImage} />} />}
      headingLevel="h3"
    />
    <EmptyStateBody>{description}</EmptyStateBody>
    {allowCreate ? (
      <EmptyStateFooter>
        <EmptyStateActions>{createButton}</EmptyStateActions>
      </EmptyStateFooter>
    ) : null}
  </EmptyState>
);

export default EmptyDetailsView;
