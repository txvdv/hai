// noinspection JSUnusedGlobalSymbols

import type { Meta, StoryObj } from '@storybook/vue3';
// @ts-ignore
import DocumentList from './DocumentList.vue';
import { FakeDocumentBrowserState } from './DocumentBrowser.state';

const meta: Meta<typeof DocumentList> = {
  title: 'Organisms/DocumentBrowser/DocumentList',
  component: DocumentList,
  args: {
    documents: FakeDocumentBrowserState.documents,
    loading: false,
  },
  argTypes: {},
};
export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    documents: FakeDocumentBrowserState.documents,
    loading: false,
  },
};
