import * as React from 'react';
import { Card, CardTitle, CardHeader, Divider, Flex } from '@patternfly/react-core';
import DashboardHelpTooltip from '~/concepts/dashboard/DashboardHelpTooltip';

export const DWSectionCard: React.FC<{
  title: string;
  helpTooltip?: string;
  hasDivider?: boolean;
  content: React.ReactNode;
}> = ({ title, hasDivider = true, helpTooltip, content }) => (
  <Card isFullHeight>
    <CardHeader>
      <CardTitle>
        <Flex gap={{ default: 'gapMd' }}>
          {title} {helpTooltip ? <DashboardHelpTooltip content={helpTooltip} /> : null}
        </Flex>
      </CardTitle>
    </CardHeader>
    {hasDivider && <Divider />}
    {content}
  </Card>
);
