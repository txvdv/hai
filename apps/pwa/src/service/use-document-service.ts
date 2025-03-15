import { inject } from 'vue';
import { UiCore } from '@hai/ui-core';

export function useDocumentService() {
  const core = inject('core') as UiCore;
  const documentService = core.getDocumentService();
  return { documentService };
}
