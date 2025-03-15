import { inject } from 'vue';
import { UiCore } from '@hai/ui-core';

/**
 * Not a stateful composable,
 * but a helper to get the DocumentService from inject
 */
export function useDocumentService() {
  const core = inject('core') as UiCore;
  const documentService = core.getDocumentService();
  return { documentService };
}
