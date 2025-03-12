// noinspection JSUnusedGlobalSymbols

import type {Meta, StoryObj} from '@storybook/vue3';
// @ts-ignore
import DocumentList from './DocumentList.vue';
import {FakeDocumentBrowserState} from "./DocumentBrowser.state";
import * as DocumentListItemStories from './DocumentListItem.stories';

const meta: Meta<typeof DocumentList> = {
  title: 'Organisms/DocumentBrowser/DocumentList',
  component: DocumentList,
  args: {
    ...DocumentListItemStories.ActionsData,
    documents: FakeDocumentBrowserState.documents,
    loading: false
  },
  argTypes: {
  }
}
export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    documents: FakeDocumentBrowserState.documents,
    loading: false
  }
};

export const Loading: Story = {
  args: {
    documents: [],
    loading: true
  }
};

export const Empty: Story = {
  args: {
    ...Loading.args,
    loading: false
  }
};
