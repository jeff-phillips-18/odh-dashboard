import { ClipboardCopy, ClipboardCopyVariant } from '@patternfly/react-core';
import * as React from 'react';

type Props = {
  textToCopy: string;
  testId?: string;
};

/** Hopefully PF will add some flexibility with ClipboardCopy
 *  in the future and this will not be necessary
 * https://github.com/patternfly/patternfly-react/issues/10890
 **/

// TODO: Test this
const InlineTruncatedClipboardCopy: React.FC<Props> = ({ textToCopy, testId }) => (
  <ClipboardCopy
    variant={ClipboardCopyVariant.expansion}
    style={{ display: 'inline-flex' }}
    hoverTip="Copy"
    clickTip="Copied"
    data-testid={testId}
  >
    {textToCopy}
  </ClipboardCopy>
);

export default InlineTruncatedClipboardCopy;
