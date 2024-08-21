import * as React from 'react';
import {
  CardBody,
  CardFooter,
  CardHeader,
  Flex,
  FlexItem,
  Content,
  GalleryItem,
  TextListItemVariants,
  TextListVariants,
} from '@patternfly/react-core';
import { Link } from 'react-router-dom';
import { ProjectObjectType } from '~/concepts/design/utils';
import { InferenceServiceKind, ServingRuntimeKind } from '~/k8sTypes';
import InferenceServiceStatus from '~/pages/modelServing/screens/global/InferenceServiceStatus';
import { isModelMesh } from '~/pages/modelServing/utils';
import ResourceNameTooltip from '~/components/ResourceNameTooltip';
import useModelMetricsEnabled from '~/pages/modelServing/useModelMetricsEnabled';
import InferenceServiceServingRuntime from '~/pages/modelServing/screens/global/InferenceServiceServingRuntime';
import InferenceServiceEndpoint from '~/pages/modelServing/screens/global/InferenceServiceEndpoint';
import TypeBorderedCard from '~/concepts/design/TypeBorderedCard';
import { SupportedArea, useIsAreaAvailable } from '~/concepts/areas/';
import { getDisplayNameFromK8sResource } from '~/concepts/k8s/utils';

interface DeployedModelCardProps {
  inferenceService: InferenceServiceKind;
  servingRuntime?: ServingRuntimeKind;
}
const DeployedModelCard: React.FC<DeployedModelCardProps> = ({
  inferenceService,
  servingRuntime,
}) => {
  const [modelMetricsEnabled] = useModelMetricsEnabled();
  const kserveMetricsEnabled = useIsAreaAvailable(SupportedArea.K_SERVE_METRICS).status;
  const modelMesh = isModelMesh(inferenceService);

  const modelMetricsSupported = modelMetricsEnabled && (modelMesh || kserveMetricsEnabled);

  const inferenceServiceDisplayName = getDisplayNameFromK8sResource(inferenceService);

  return (
    <GalleryItem key={inferenceService.metadata.uid}>
      <TypeBorderedCard objectType={ProjectObjectType.modelServer}>
        <CardHeader>
          <Flex gap={{ default: 'gapSm' }} direction={{ default: 'column' }}>
            <FlexItem>
              <InferenceServiceStatus
                inferenceService={inferenceService}
                isKserve={!isModelMesh(inferenceService)}
                iconSize="lg"
              />
            </FlexItem>
            <FlexItem>
              <ResourceNameTooltip resource={inferenceService}>
                {modelMetricsSupported ? (
                  <Link
                    to={`/projects/${inferenceService.metadata.namespace}/metrics/model/${inferenceService.metadata.name}`}
                  >
                    {inferenceServiceDisplayName}
                  </Link>
                ) : (
                  inferenceServiceDisplayName
                )}
              </ResourceNameTooltip>
            </FlexItem>
          </Flex>
        </CardHeader>
        <CardBody>
          <Content>
            <Content component={TextListVariants.dl} style={{ display: 'block' }}>
              <Content
                component={TextListItemVariants.dt}
                style={{ marginBottom: 'var(--pf-v6-global--spacer--xs)' }}
              >
                Serving runtime
              </Content>
              <Content
                component={TextListItemVariants.dd}
                style={{
                  fontSize: 'var(--pf-v6-global--FontSize--sm)',
                  color: !servingRuntime ? 'var(--pf-v6-global--Color--200)' : undefined,
                }}
              >
                <InferenceServiceServingRuntime servingRuntime={servingRuntime} />
              </Content>
            </Content>
          </Content>
        </CardBody>
        <CardFooter>
          <InferenceServiceEndpoint
            inferenceService={inferenceService}
            servingRuntime={servingRuntime}
            isKserve={!isModelMesh(inferenceService)}
          />
        </CardFooter>
      </TypeBorderedCard>
    </GalleryItem>
  );
};

export default DeployedModelCard;
