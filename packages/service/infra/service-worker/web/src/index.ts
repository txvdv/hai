export type { AppService } from './app-service.js';
export { getAppService } from './app-service.js';

// -----------------------------------------------------------------------------
// Messaging API
// -----------------------------------------------------------------------------
export type {
  ProblemDetails,
  RequestMessageEnvelope,
  ResponseMessageEnvelope,
} from './messaging-infra/index.js';

export type {
  paths as DocumentsPaths,
  components as DocumentComponents,
} from './documents/schema.js';
