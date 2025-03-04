export function documentService(): string {
  return 'document-service';
}

export type Document = {
  id: string
  content: string
};

export class DocumentService {
  documents: Document[] = [];

  async getDocument(id: string) {
    return this.documents.find(doc => doc.id === id);
  }

  async getDocuments() {
    return this.documents;
  }

  async createDocument(content: string) {
    const document = {
      id: generateShortUniqueId(),
      content
    };
    this.documents.push(document);
    return document;
  }

  async updateDocument(id: string, content: string) {
    const document = this.documents.find(doc => doc.id === id);
    if (document) {
      document.content = content;
    }
  }

  async deleteDocument(id: string) {
    this.documents = this.documents.filter(doc => doc.id !== id);
  }
}

function generateShortUniqueId(): string {
  return [...Array(9)].map(() => Math.random().toString(36)[2]).join('');
}