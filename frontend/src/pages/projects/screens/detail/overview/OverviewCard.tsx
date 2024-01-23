import * as React from 'react';
import { css } from '@patternfly/react-styles';
import { useSearchParams } from 'react-router-dom';
import {
  Button,
  EmptyState,
  EmptyStateActions,
  EmptyStateBody,
  EmptyStateFooter,
  EmptyStateHeader,
  EmptyStateIcon,
  Spinner,
} from '@patternfly/react-core';
import { ExclamationCircleIcon, PlusCircleIcon } from '@patternfly/react-icons';

type OverviewCardProps = {
  loading?: boolean;
  loadError?: Error;
  count: number;
  title: string;
  description?: string;
  icon?: React.ComponentType;
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
      <div className={css('odh-project-overview__card loading')}>
        <EmptyState variant="xs">
          <EmptyStateHeader
            icon={<EmptyStateIcon icon={() => <Spinner size="lg" />} />}
            headingLevel="h3"
          />
          <EmptyStateBody>Loading...</EmptyStateBody>
        </EmptyState>
      </div>
    );
  }

  if (loadError) {
    return (
      <div className={css('odh-project-overview__card error')}>
        <EmptyState variant="xs">
          <EmptyStateHeader
            icon={
              <EmptyStateIcon
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
            }
            headingLevel="h3"
          />
          <EmptyStateBody>
            {loadError.message ??
              'There was an issue loading the resources. Please try again later.'}
          </EmptyStateBody>
        </EmptyState>
      </div>
    );
  }
  if (!count) {
    return (
      <div className={css('odh-project-overview__card', typeModifier)}>
        <EmptyState variant="lg">
          <EmptyStateHeader
            titleText={<>{title}</>}
            icon={icon && <EmptyStateIcon icon={icon ?? PlusCircleIcon} />}
            headingLevel="h3"
          />
          <EmptyStateBody>{description}</EmptyStateBody>
          {actionButton || allowCreate ? (
            <EmptyStateFooter>
              <EmptyStateActions>
                {actionButton || (
                  <Button
                    onClick={(e) => {
                      e.stopPropagation();
                      onAction && onAction();
                    }}
                    variant="link"
                  >
                    Get started
                  </Button>
                )}
              </EmptyStateActions>
            </EmptyStateFooter>
          ) : null}
        </EmptyState>
      </div>
    );
  }

  return (
    <div
      className={css(
        'odh-project-overview__card with-counts',
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
      <EmptyState variant="sm">
        <EmptyStateHeader
          titleText={<>{`${count}`}</>}
          icon={icon && <EmptyStateIcon icon={icon ?? PlusCircleIcon} />}
          headingLevel="h3"
        />
        <EmptyStateBody>{title}</EmptyStateBody>
        {actionButton || allowCreate ? (
          <EmptyStateFooter>
            <EmptyStateActions>
              {actionButton || (
                <Button
                  onClick={(e) => {
                    e.stopPropagation();
                    onAction && onAction();
                  }}
                  variant="link"
                >
                  {createText}
                </Button>
              )}
            </EmptyStateActions>
          </EmptyStateFooter>
        ) : null}
      </EmptyState>
    </div>
  );
};

export default OverviewCard;
