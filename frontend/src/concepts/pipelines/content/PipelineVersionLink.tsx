import React from 'react';
import { Link } from 'react-router-dom';
import { Skeleton, Tooltip } from '@patternfly/react-core';
import { usePipelinesAPI } from '~/concepts/pipelines/context';
import { PipelineVersionKFv2 } from '~/concepts/pipelines/kfTypes';
import { pipelineVersionDetailsRoute } from '~/routes';
import { NoRunContent } from './tables/renderUtils';

interface PipelineVersionLinkProps {
  displayName?: string;
  loadingIndicator?: React.ReactElement;
  version?: PipelineVersionKFv2 | null;
  error?: Error;
  loaded: boolean;
}

export const PipelineVersionLink: React.FC<PipelineVersionLinkProps> = ({
  displayName,
  loadingIndicator,
  version,
  error,
  loaded,
}) => {
  const { namespace } = usePipelinesAPI();

  if (!loaded && !error) {
    return loadingIndicator || <Skeleton />;
  }

  if (error) {
    return (
      <Tooltip content={error.message} position="right">
        {/* Need to check if the color contrast looks okay. Note from PatternFly: revisit this implementation (possibly add tabIndex of 0) as it isn't accessible */}
        <div className="pf-v6-u-text-color-disabled pf-v6-c-truncate__start">{displayName}</div>
      </Tooltip>
    );
  }

  if (!version) {
    return <NoRunContent />;
  }

  return (
    <Link
      to={pipelineVersionDetailsRoute(namespace, version.pipeline_id, version.pipeline_version_id)}
    >
      {version.display_name}
    </Link>
  );
};
