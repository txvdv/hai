export type LibraryViewState = Readonly<{
  folderVisibility: { [folderID: string]: boolean }
  library: {
    inbox: Array<Item>
    sortBy: string
    sortOrder: string
    folders: Array<Folder>
  }
}>

export type Folder = {
  id: string
  name: string
  sortBy: string
  sortOrder: string
  items: Array<Item>
}

export type Item = {
  id: string
  title: string
  trigger: string
  type: string
  note: string
  scope: string
  dateCreated: number
  texts: Array<Variant>
}

type Variant = {
  id: string
  text: string
  status: "DRAFT" | "PUBLISHED"
  errors: string[]
}

export const FakeLibraryViewState: LibraryViewState = {
  folderVisibility: {},
  library: {
    inbox: [
      {
        id: "550e8400-e29b-41d4-a716-446655440000",
        title: "Inbox Item 1",
        trigger: "trigger1",
        type: "SNIPPET",
        note: "Note for inbox item 1",
        scope: "USER",
        dateCreated: new Date("2025-01-03").getTime(),
        texts: [
          {
            id: "6ba7b810-9dad-11d1-80b4-00c04fd430c8",
            text: "Inbox 1 Variant 1",
            status: "PUBLISHED",
            errors: []
          }
        ]
      },
      {
        id: "7d9fd6f0-f12a-4814-b3a1-26236d0534b1",
        title: "Inbox Item 2",
        trigger: "trigger2",
        type: "MACRO",
        note: "Note for inbox item 2",
        scope: "USER",
        dateCreated: new Date("2025-01-15").getTime(),
        texts: [
          {
            id: "8e1f3a20-c5eb-4c9d-b912-93e4c23912a0",
            text: "Inbox 2 Variant 1",
            status: "PUBLISHED",
            errors: []
          },
          {
            id: "9c4f2d30-b7ac-4e8b-9d23-84f5d1290b9",
            text: "Inbox 2 Variant 2",
            status: "PUBLISHED",
            errors: []
          }
        ]
      },
      {
        id: "a1b2c3d4-e5f6-4a5b-9c8d-7e6f5a4b3c2d",
        title: "Inbox Item 3",
        trigger: "trigger3",
        type: "SNIPPET",
        note: "Note for inbox item 3",
        scope: "USER",
        dateCreated: new Date("2025-01-07").getTime(),
        texts: [
          {
            id: "b2c3d4e5-f6a7-5b6c-0d1e-8f7g6h5i4j3k",
            text: "Inbox 3 Variant 1",
            status: "PUBLISHED",
            errors: []
          },
          {
            id: "c3d4e5f6-g7h8-6c7d-1e2f-9g8h7i6j5k4l",
            text: "Inbox 3 Variant 2",
            status: "PUBLISHED",
            errors: []
          }
        ]
      }
    ],
    sortBy: "dateCreated",
    sortOrder: "desc",
    folders: [
      {
        id: "e5f6g7h8-i9j0-8e9f-3g4h-1i0j9k8l7m6n",
        name: "Folder 1",
        sortBy: "title",
        sortOrder: "asc",
        items: [
          {
            id: "f6g7h8i9-j0k1-9f0g-4h5i-2j1k0l9m8n7o",
            title: "Folder 1 Item 1",
            trigger: "f1t1",
            type: "MACRO",
            note: "Note for folder 1 item 1",
            scope: "USER",
            dateCreated: new Date("2025-01-01").getTime(),
            texts: [
              {
                id: "g7h8i9j0-k1l2-0g1h-5i6j-3k2l1m0n9o8p",
                text: "F1 Item 1 Variant 1",
                status: "PUBLISHED",
                errors: []
              }
            ]
          },
          {
            id: "h8i9j0k1-l2m3-1h2i-6j7k-4l3m2n1o0p9q",
            title: "Folder 1 Item 2",
            trigger: "f1t2",
            type: "SNIPPET",
            note: "Note for folder 1 item 2",
            scope: "USER",
            dateCreated: new Date("2025-01-20").getTime(),
            texts: [
              {
                id: "i9j0k1l2-m3n4-2i3j-7k8l-5m4n3o2p1q0r",
                text: "F1 Item 2 Variant 1",
                status: "PUBLISHED",
                errors: []
              },
              {
                id: "j0k1l2m3-n4o5-3j4k-8l9m-6n5o4p3q2r1s",
                text: "F1 Item 2 Variant 2",
                status: "PUBLISHED",
                errors: []
              }
            ]
          },
          {
            id: "k1l2m3n4-o5p6-4k5l-9m0n-7o6p5q4r3s2t",
            title: "Folder 1 Item 3",
            trigger: "f1t3",
            type: "MACRO",
            note: "Note for folder 1 item 3",
            scope: "USER",
            dateCreated: new Date("2025-01-25").getTime(),
            texts: [
              {
                id: "l2m3n4o5-p6q7-5l6m-0n1o-8p7q6r5s4t3u",
                text: "F1 Item 3 Variant 1",
                status: "PUBLISHED",
                errors: []
              }
            ]
          }
        ]
      },
      {
        id: "n4o5p6q7-r8s9-7n8o-2p3q-0r9s8t7u6v5w",
        name: "Folder 2",
        sortBy: "title",
        sortOrder: "asc",
        items: [
          {
            id: "o5p6q7r8-s9t0-8o9p-3q4r-1s0t9u8v7w6x",
            title: "Folder 2 Item 1",
            trigger: "f2t1",
            type: "SNIPPET",
            note: "Note for folder 2 item 1",
            scope: "USER",
            dateCreated: new Date("2025-01-05").getTime(),
            texts: [
              {
                id: "p6q7r8s9-t0u1-9p0q-4r5s-2t1u0v9w8x7y",
                text: "F2 Item 1 Variant 1",
                status: "PUBLISHED",
                errors: []
              },
              {
                id: "q7r8s9t0-u1v2-0q1r-5s6t-3u2v1w0x9y8z",
                text: "F2 Item 1 Variant 2",
                status: "PUBLISHED",
                errors: []
              }
            ]
          },
          {
            id: "s9t0u1v2-w3x4-2s3t-7u8v-5w4x3y2z1a0b",
            title: "Folder 2 Item 2",
            trigger: "f2t2",
            type: "MACRO",
            note: "Note for folder 2 item 2",
            scope: "USER",
            dateCreated: new Date("2025-01-12").getTime(),
            texts: [
              {
                id: "t0u1v2w3-x4y5-3t4u-8v9w-6x5y4z3a2b1c",
                text: "F2 Item 2 Variant 1",
                status: "PUBLISHED",
                errors: []
              }
            ]
          },
          {
            id: "u1v2w3x4-y5z6-4u5v-9w0x-7y6z5a4b3c2d",
            title: "Folder 2 Item 3",
            trigger: "f2t3",
            type: "SNIPPET",
            note: "Note for folder 2 item 3",
            scope: "USER",
            dateCreated: new Date("2025-01-18").getTime(),
            texts: [
              {
                id: "v2w3x4y5-z6a7-5v6w-0x1y-8z7a6b5c4d3e",
                text: "F2 Item 3 Variant 1",
                status: "PUBLISHED",
                errors: []
              },
              {
                id: "w3x4y5z6-a7b8-6w7x-1y2z-9a8b7c6d5e4f",
                text: "F2 Item 3 Variant 2",
                status: "PUBLISHED",
                errors: []
              }
            ]
          }
        ]
      },
      {
        id: "x4y5z6a7-b8c9-7x8y-2z3a-0b9c8d7e6f5g",
        name: "Folder 3",
        sortBy: "title",
        sortOrder: "asc",
        items: [
          {
            id: "y5z6a7b8-c9d0-8y9z-3a4b-1c0d9e8f7g6h",
            title: "Folder 3 Item 1",
            trigger: "f3t1",
            type: "MACRO",
            note: "Note for folder 3 item 1",
            scope: "USER",
            dateCreated: new Date("2025-01-10").getTime(),
            texts: [
              {
                id: "z6a7b8c9-d0e1-9z0a-4b5c-2d1e0f9g8h7i",
                text: "F3 Item 1 Variant 1",
                status: "PUBLISHED",
                errors: []
              },
              {
                id: "a7b8c9d0-e1f2-0a1b-5c6d-3e2f1g0h9i8j",
                text: "F3 Item 1 Variant 2",
                status: "PUBLISHED",
                errors: []
              }
            ]
          },
          {
            id: "b8c9d0e1-f2g3-1b2c-6d7e-4f3g2h1i0j9k",
            title: "Folder 3 Item 2",
            trigger: "f3t2",
            type: "SNIPPET",
            note: "Note for folder 3 item 2",
            scope: "USER",
            dateCreated: new Date("2025-01-28").getTime(),
            texts: [
              {
                id: "c9d0e1f2-g3h4-2c3d-7e8f-5g4h3i2j1k0l",
                text: "F3 Item 2 Variant 1",
                status: "PUBLISHED",
                errors: []
              }
            ]
          },
          {
            id: "e1f2g3h4-i5j6-4e5f-9g0h-7i6j5k4l3m2n",
            title: "Folder 3 Item 3",
            trigger: "f3t3",
            type: "MACRO",
            note: "Note for folder 3 item 3",
            scope: "USER",
            dateCreated: new Date("2025-01-31").getTime(),
            texts: [
              {
                id: "f2g3h4i5-j6k7-5f6g-0h1i-8j7k6l5m4n3o",
                text: "F3 Item 3 Variant 1",
                status: "PUBLISHED",
                errors: []
              }
            ]
          }
        ]
      }
    ]
  }
};
