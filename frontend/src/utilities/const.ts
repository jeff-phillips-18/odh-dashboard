import { OdhDocumentType } from '../types';

export const DEV_MODE = process.env.APP_ENV === 'development';
export const TEST_MODE = process.env.APP_ENV === 'test';
export const API_PORT = process.env.BACKEND_PORT || 8080;
export const POLL_INTERVAL = process.env.POLL_INTERVAL ? parseInt(process.env.POLL_INTERVAL) : 30000;
export const DOC_LINK = process.env.DOC_LINK;
export const COMMUNITY_LINK = process.env.COMMUNITY_LINK;
export const SUPPORT_LINK = process.env.SUPPORT_LINK;

export const DOC_TYPE_TOOLTIPS = {
  [OdhDocumentType.Documentation]: 'Technical information for using the service',
  [OdhDocumentType.Tutorial]: 'End-to-end guides for solving business problems in data science',
  [OdhDocumentType.QuickStart]: 'Step-by-step instructions and tasks',
  [OdhDocumentType.HowTo]: 'Instructions and code for everyday procedures',
};

export const CATEGORY_ANNOTATION = 'opendatahub.io/categories';
