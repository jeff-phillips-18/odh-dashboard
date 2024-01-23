import * as React from 'react';
import { css } from '@patternfly/react-styles';
import { useSearchParams } from 'react-router-dom';
import { Button, Spinner } from '@patternfly/react-core';
import { ExclamationCircleIcon } from '@patternfly/react-icons';
import EmptyDetailsList from '~/pages/projects/screens/detail/EmptyDetailsList';

type OverviewCardProps = {
  loading?: boolean;
  loadError?: Error;
  count: number;
  title?: string;
  description?: string;
  icon?: React.ComponentType;
  ignoreEmptyState?: boolean;
  allowCreate?: boolean;
  actionButton?: React.ReactNode;
  onAction?: () => void;
  createText?: string;
  typeModifier:
    | 'notebook'
    | 'pipeline'
    | 'cluster-storage'
    | 'model-server'
    | 'data-connections'
    | 'user'
    | 'group';
  navSection?: string;
};
const OverviewCard: React.FC<OverviewCardProps> = ({
  loading,
  loadError,
  count,
  title,
  description,
  icon,
  ignoreEmptyState,
  allowCreate,
  actionButton,
  onAction,
  createText,
  typeModifier,
  navSection,
}) => {
  const [queryParams, setQueryParams] = useSearchParams();

  if (loading) {
    return (
      <div className={css('odh-project-details__card loading')}>
        <EmptyDetailsList
          variant="xs"
          description="Loading..."
          icon={() => <Spinner size="lg" />}
        />
      </div>
    );
  }

  if (loadError) {
    return (
      <div className={css('odh-project-details__card error')}>
        <EmptyDetailsList
          variant="xs"
          description={
            loadError.message ?? 'There was an issue loading the resources. Please try again later.'
          }
          icon={() => (
            <ExclamationCircleIcon
              style={{
                color: 'var(--pf-v5-global--danger-color--100)',
                width: '32px',
                height: '32px',
              }}
            />
          )}
        />
      </div>
    );
  }
  if (!count && !ignoreEmptyState) {
    return (
      <div className={css('odh-project-details__card', typeModifier)}>
        <EmptyDetailsList
          variant="lg"
          title={title}
          description={description}
          icon={icon}
          actions={
            actionButton ||
            (allowCreate ? (
              <Button
                onClick={(e) => {
                  e.stopPropagation();
                  onAction && onAction();
                }}
                variant="secondary"
                size="lg"
              >
                {createText}
              </Button>
            ) : undefined)
          }
        />
      </div>
    );
  }

  return (
    <div
      className={css(
        'odh-project-details__card with-counts',
        typeModifier,
        navSection && 'm-is-clickable',
      )}
      onClick={
        navSection
          ? () => {
              queryParams.set('section', navSection || '');
              setQueryParams(queryParams);
            }
          : undefined
      }
    >
      <EmptyDetailsList
        variant="lg"
        title={`${count}`}
        description={title}
        icon={icon}
        actions={
          actionButton ||
          (allowCreate ? (
            <Button
              onClick={(e) => {
                e.stopPropagation();
                onAction && onAction();
              }}
              variant="link"
            >
              {createText}
            </Button>
          ) : undefined)
        }
      />
    </div>
  );
};

export default OverviewCard;
