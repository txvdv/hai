export interface DocumentBrowserState {
  documents: DocumentListItem[]
}

export type DocumentListItem = {
  id: string
  title: string
  content: string
  context: Array<{
    id: string
    // the full http reference path where the context source can be found
    href: string
    rel: "primary" | "supplementary"
    // whether the context description is available (i.e. uploaded)
    available: boolean
    // the browser tab id containing the href
    tabId: number | undefined
  }>
  dateCreated: Date
  dateModified: Date
  metadata: Array<{ name: string; content: string }>
}

export const FakeDocumentBrowserState: DocumentBrowserState = {
  documents: [
    {
      id: "1",
      title: "My first document",
      content: "This is my first document",
      context: [{
        id: "1",
        href: "https://example.com/context/1",
        rel: "primary",
        available: true,
        tabId: 1
      }],
      dateCreated: new Date("2025-01-01"),
      dateModified: new Date(),
      metadata: [{
        name: "Author",
        content: "<NAME>"
      }]
    },
    {
      id: "2",
      title: "My second document",
      content: "This is my second document",
      context: [{
        id: "2",
        href: "https://example.com/context/2",
        rel: "primary",
        available: true,
        tabId: 1
      }],
      dateCreated: new Date("2025-01-02"),
      dateModified: new Date(),
      metadata: [{
        name: "Author",
        content: "<NAME>"
      }]
    },
    {
      id: "3",
      title: "Project Requirements",
      content: "Project requirements documentation",
      context: [{
        id: "3",
        href: "https://example.com/context/3",
        rel: "primary",
        available: true,
        tabId: 2
      }],
      dateCreated: new Date("2025-01-03"),
      dateModified: new Date(),
      metadata: [{
        name: "Author",
        content: "<NAME>"
      }]
    },
    {
      id: "4",
      title: "Meeting Notes",
      content: "Weekly meeting notes",
      context: [{
        id: "4",
        href: "https://example.com/context/4",
        rel: "supplementary",
        available: true,
        tabId: 2
      }],
      dateCreated: new Date("2025-01-04"),
      dateModified: new Date(),
      metadata: [{
        name: "Author",
        content: "<NAME>"
      }]
    },
    {
      id: "5",
      title: "Technical Specification",
      content: "System technical specifications",
      context: [{
        id: "5",
        href: "https://example.com/context/5",
        rel: "primary",
        available: true,
        tabId: 3
      }],
      dateCreated: new Date("2025-01-05"),
      dateModified: new Date(),
      metadata: [{
        name: "Author",
        content: "<NAME>"
      }]
    },
    {
      id: "6",
      title: "User Guide",
      content: "End user documentation",
      context: [{
        id: "6",
        href: "https://example.com/context/6",
        rel: "primary",
        available: false,
        tabId: 3
      }],
      dateCreated: new Date("2025-01-06"),
      dateModified: new Date(),
      metadata: [{
        name: "Author",
        content: "<NAME>"
      }]
    },
    {
      id: "7",
      title: "API Documentation",
      content: "API endpoints and usage",
      context: [{
        id: "7",
        href: "https://example.com/context/7",
        rel: "primary",
        available: true,
        tabId: 4
      }],
      dateCreated: new Date("2025-01-07"),
      dateModified: new Date(),
      metadata: [{
        name: "Author",
        content: "<NAME>"
      }]
    },
    {
      id: "8",
      title: "Release Notes",
      content: "Version 2.0 release notes",
      context: [{
        id: "8",
        href: "https://example.com/context/8",
        rel: "supplementary",
        available: true,
        tabId: 4
      }],
      dateCreated: new Date("2025-01-08"),
      dateModified: new Date(),
      metadata: [{
        name: "Author",
        content: "<NAME>"
      }]
    },
    {
      id: "9",
      title: "Database Schema",
      content: "Database structure documentation",
      context: [{
        id: "9",
        href: "https://example.com/context/9",
        rel: "primary",
        available: true,
        tabId: 5
      }],
      dateCreated: new Date("2025-01-09"),
      dateModified: new Date(),
      metadata: [{
        name: "Author",
        content: "<NAME>"
      }]
    },
    {
      id: "10",
      title: "Testing Strategy",
      content: "QA testing approach",
      context: [{
        id: "10",
        href: "https://example.com/context/10",
        rel: "primary",
        available: false,
        tabId: 5
      }],
      dateCreated: new Date("2025-01-10"),
      dateModified: new Date(),
      metadata: [{
        name: "Author",
        content: "<NAME>"
      }]
    },
    {
      id: "11",
      title: "Deployment Guide",
      content: "System deployment procedures",
      context: [{
        id: "11",
        href: "https://example.com/context/11",
        rel: "primary",
        available: true,
        tabId: 6
      }],
      dateCreated: new Date("2025-01-11"),
      dateModified: new Date(),
      metadata: [{
        name: "Author",
        content: "<NAME>"
      }]
    },
    {
      id: "12",
      title: "Security Protocol",
      content: "Security measures documentation",
      context: [{
        id: "12",
        href: "https://example.com/context/12",
        rel: "primary",
        available: true,
        tabId: 6
      }],
      dateCreated: new Date("2025-01-12"),
      dateModified: new Date(),
      metadata: [{
        name: "Author",
        content: "<NAME>"
      }]
    },
    {
      id: "13",
      title: "Code Review Guidelines",
      content: "Code review process and standards",
      context: [{
        id: "13",
        href: "https://example.com/context/13",
        rel: "supplementary",
        available: true,
        tabId: 7
      }],
      dateCreated: new Date("2025-01-13"),
      dateModified: new Date(),
      metadata: [{
        name: "Author",
        content: "<NAME>"
      }]
    },
    {
      id: "14",
      title: "Architecture Overview",
      content: "System architecture documentation",
      context: [{
        id: "14",
        href: "https://example.com/context/14",
        rel: "primary",
        available: true,
        tabId: 7
      }],
      dateCreated: new Date("2025-01-14"),
      dateModified: new Date(),
      metadata: [{
        name: "Author",
        content: "<NAME>"
      }]
    },
    {
      id: "15",
      title: "Project Timeline",
      content: "Development milestones and deadlines",
      context: [{
        id: "15",
        href: "https://example.com/context/15",
        rel: "primary",
        available: true,
        tabId: 8
      }],
      dateCreated: new Date("2025-01-15"),
      dateModified: new Date(),
      metadata: [{
        name: "Author",
        content: "<NAME>"
      }]
    },
    {
      id: "16",
      title: "Budget Report",
      content: "Project budget analysis",
      context: [{
        id: "16",
        href: "https://example.com/context/16",
        rel: "supplementary",
        available: false,
        tabId: 8
      }],
      dateCreated: new Date("2025-01-16"),
      dateModified: new Date(),
      metadata: [{
        name: "Author",
        content: "<NAME>"
      }]
    },
    {
      id: "17",
      title: "Component Library",
      content: "UI component documentation",
      context: [{
        id: "17",
        href: "https://example.com/context/17",
        rel: "primary",
        available: true,
        tabId: 9
      }],
      dateCreated: new Date("2025-01-17"),
      dateModified: new Date(),
      metadata: [{
        name: "Author",
        content: "<NAME>"
      }]
    },
    {
      id: "18",
      title: "Style Guide",
      content: "Design system guidelines",
      context: [{
        id: "18",
        href: "https://example.com/context/18",
        rel: "primary",
        available: true,
        tabId: 9
      }],
      dateCreated: new Date("2025-01-18"),
      dateModified: new Date(),
      metadata: [{
        name: "Author",
        content: "<NAME>"
      }]
    },
    {
      id: "19",
      title: "Performance Metrics",
      content: "System performance analysis",
      context: [{
        id: "19",
        href: "https://example.com/context/19",
        rel: "primary",
        available: true,
        tabId: 10
      }],
      dateCreated: new Date("2025-01-19"),
      dateModified: new Date(),
      metadata: [{
        name: "Author",
        content: "<NAME>"
      }]
    },
    {
      id: "20",
      title: "Maintenance Schedule",
      content: "System maintenance procedures",
      context: [{
        id: "20",
        href: "https://example.com/context/20",
        rel: "supplementary",
        available: true,
        tabId: 10
      }],
      dateCreated: new Date("2025-01-20"),
      dateModified: new Date(),
      metadata: [{
        name: "Author",
        content: "<NAME>"
      }]
    }
  ]
}
