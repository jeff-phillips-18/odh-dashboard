import React from 'react';
import { Card, CardBody, CardFooter, CardHeader, CardTitle, Tooltip } from '@patternfly/react-core';
import { ExternalLinkAltIcon, TagIcon } from '@patternfly/react-icons';
import { QuickStartContext, QuickStartContextValues } from '@cloudmosaic/quickstarts';
import { ODHDoc, ODHDocType } from '../types';
import {
  getQuickStartLabel,
  isQuickStartInProgress,
  launchQuickStart,
} from '../utilities/quickStartUtils';
import { getTextForDocType } from '../pages/learningCenter/learningCenterUtils';
import BrandImage from './BrandImage';

import './OdhCard.scss';

type OdhDocCardProps = {
  odhDoc: ODHDoc;
};

const OdhDocCard: React.FC<OdhDocCardProps> = ({ odhDoc }) => {
  const qsContext = React.useContext<QuickStartContextValues>(QuickStartContext);

  if (odhDoc.metadata.type === ODHDocType.QuickStart) {
    const quickStart = qsContext.allQuickStarts?.find(
      (qs) => qs.metadata.name === odhDoc.metadata.name,
    );
    if (!quickStart) {
      return null;
    }
  }

  const onQuickStart = (e) => {
    e.preventDefault();
    launchQuickStart(odhDoc.metadata.name, qsContext);
  };

  const renderDocBadges = () => {
    const label = getTextForDocType(odhDoc.metadata.type as ODHDocType);
    if (odhDoc.metadata.type === ODHDocType.Documentation) {
      return (
        <div className="odh-card__doc-badges">
          <Tooltip content="Technical information for using the service">
            <div className="odh-card__partner-badge odh-m-doc odh-m-documentation">{label}</div>
          </Tooltip>
          <div className="odh-card__partner-badge odh-m-doc m-hidden">N/A</div>
        </div>
      );
    }
    if (odhDoc.metadata.type === ODHDocType.Tutorial) {
      return (
        <div className="odh-card__doc-badges">
          <Tooltip content="End-to-end guides for solving business problems in data science">
            <div className="odh-card__partner-badge odh-m-doc odh-m-tutorial">{label}</div>
          </Tooltip>
          <div className="odh-card__partner-badge odh-m-doc odh-m-duration">
            {odhDoc.spec.durationMinutes} minutes
          </div>
        </div>
      );
    }
    if (odhDoc.metadata.type === ODHDocType.QuickStart) {
      if (!qsContext.allQuickStarts) {
        return null;
      }
      const quickStart = qsContext.allQuickStarts.find(
        (qs) => qs.metadata.name === odhDoc.metadata.name,
      );
      if (!quickStart) {
        return null;
      }
      return (
        <>
          <div className="odh-card__doc-badges">
            <Tooltip content="Step-by-step instructions and tasks">
              <div className="odh-card__partner-badge odh-m-doc odh-m-quick-start">{label}</div>
            </Tooltip>
            <div className="odh-card__partner-badge odh-m-doc odh-m-duration">
              {odhDoc.spec.durationMinutes} minutes
            </div>
          </div>
          {isQuickStartInProgress(quickStart.metadata.name, qsContext) ? (
            <div className="odh-card__doc-badges .m-progress">
              <div className="odh-card__partner-badge odh-m-doc odh-m-in-progress">
                <TagIcon />
                In Progress
              </div>
            </div>
          ) : null}
        </>
      );
    }
    if (odhDoc.metadata.type === ODHDocType.HowTo) {
      return (
        <div className="odh-card__doc-badges">
          <Tooltip content="Instructions and code for everyday procedures">
            <div className="odh-card__partner-badge odh-m-doc odh-m-how-to">{label}</div>
          </Tooltip>
          <div className="odh-card__partner-badge odh-m-doc odh-m-duration">
            {odhDoc.spec.durationMinutes} minutes
          </div>
        </div>
      );
    }
    return null;
  };

  const renderDocLink = () => {
    if (odhDoc.metadata.type === ODHDocType.Documentation) {
      return (
        <a
          className="odh-card__footer__link"
          href={odhDoc.spec?.url ?? '#'}
          target="_blank"
          rel="noopener noreferrer"
        >
          Go to page
          <ExternalLinkAltIcon />
        </a>
      );
    }
    if (odhDoc.metadata.type === ODHDocType.Tutorial) {
      return (
        <a
          className="odh-card__footer__link"
          href={odhDoc.spec?.url ?? '#'}
          target="_blank"
          rel="noopener noreferrer"
        >
          Access tutorial
          <ExternalLinkAltIcon />
        </a>
      );
    }
    if (odhDoc.metadata.type === ODHDocType.QuickStart) {
      return (
        <a className="odh-card__footer__link" href="#" onClick={onQuickStart}>
          {getQuickStartLabel(odhDoc.metadata.name, qsContext)}
        </a>
      );
    }
    if (odhDoc.metadata.type === ODHDocType.HowTo) {
      return (
        <a
          className="odh-card__footer__link"
          href={odhDoc.spec?.url ?? '#'}
          target="_blank"
          rel="noopener noreferrer"
        >
          How to?
          <ExternalLinkAltIcon />
        </a>
      );
    }
    return null;
  };

  return (
    <Card isHoverable className="odh-card">
      <CardHeader>
        <BrandImage src={odhDoc.spec.img || odhDoc.spec.icon || ''} alt={odhDoc.spec.displayName} />
      </CardHeader>
      <CardTitle className="odh-card__doc-title">
        {odhDoc.spec.displayName}
        {renderDocBadges()}
      </CardTitle>
      <CardBody>{odhDoc.spec.description}</CardBody>
      <CardFooter className="odh-card__footer">{renderDocLink()}</CardFooter>
    </Card>
  );
};

export default OdhDocCard;
