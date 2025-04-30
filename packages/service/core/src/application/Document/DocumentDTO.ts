import { Document } from '../../domain/Document/Document.js';

export type DocumentDTO = {
  id: string;
  content: string;
};

export function mapToDTO(doc: Document): DocumentDTO {
  return {
    id: doc.getId().toString(),
    content: doc.getContent(),
  };
}
