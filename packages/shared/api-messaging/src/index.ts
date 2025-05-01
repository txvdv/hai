// -----------------------------------------------------------------------------
// API
// -----------------------------------------------------------------------------
export type {
  paths as DocumentsPaths,
  components as DocumentComponents,
} from './api.schema.js';

// -----------------------------------------------------------------------------
// Messaging
// -----------------------------------------------------------------------------

export { createRequestMessage, createResponseMessage } from './messaging.js';

export type {
  ProblemDetails,
  RequestMessageEnvelope,
  ResponseMessageEnvelope,
} from './messaging.js';
