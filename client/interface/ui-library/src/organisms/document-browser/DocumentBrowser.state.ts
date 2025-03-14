export interface DocumentBrowserState {
  documents: DocumentListItem[];
}

export type DocumentListItem = {
  id: string;
  title: string;
  content: string;
  context: Array<{
    id: string;
    // the full http reference path where the context source can be found
    href: string;
    rel: 'primary' | 'supplementary';
    // whether the context description is available (i.e. uploaded)
    available: boolean;
    // the browser tab id containing the href
    tabId: number | undefined;
  }>;
  dateCreated: Date;
  dateModified: Date;
  metadata: Array<{ name: string; content: string }>;
};

export const FakeDocumentBrowserState: DocumentBrowserState = {
  documents: [
    {
      id: '1',
      title: 'My first document',
      content:
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam.',
      context: [
        {
          id: '1',
          href: 'https://example.com/context/1',
          rel: 'primary',
          available: true,
          tabId: 1,
        },
      ],
      dateCreated: new Date('2025-01-01'),
      dateModified: new Date(),
      metadata: [
        {
          name: 'Author',
          content: '<NAME>',
        },
      ],
    },
    {
      id: '2',
      title: 'My second document',
      content:
        'Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident. Sunt in culpa qui officia deserunt mollit anim id est laborum.',
      context: [
        {
          id: '2',
          href: 'https://example.com/context/2',
          rel: 'primary',
          available: true,
          tabId: 1,
        },
      ],
      dateCreated: new Date('2025-01-02'),
      dateModified: new Date(),
      metadata: [
        {
          name: 'Author',
          content: '<NAME>',
        },
      ],
    },
    {
      id: '3',
      title: 'Project Requirements',
      content:
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque vehicula, justo sit amet sagittis consectetur, est enim tristique enim, sed consequat nunc erat at libero.',
      context: [
        {
          id: '3',
          href: 'https://example.com/context/3',
          rel: 'primary',
          available: true,
          tabId: 2,
        },
      ],
      dateCreated: new Date('2025-01-03'),
      dateModified: new Date(),
      metadata: [
        {
          name: 'Author',
          content: '<NAME>',
        },
      ],
    },
  ],
};
