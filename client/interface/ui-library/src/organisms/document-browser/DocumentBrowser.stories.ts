// noinspection JSUnusedGlobalSymbols

import type { Meta, StoryObj } from '@storybook/vue3';
import { fn } from '@storybook/test';
// @ts-ignore
import DocumentBrowser from './DocumentBrowser.vue';
import { FakeDocumentBrowserState } from './DocumentBrowser.state';
import * as DocumentListItemStories from './DocumentListItem.stories';

/**
 * Issue: Vue3 Automatic inference argTypes don't work well
 * https://github.com/storybookjs/storybook/issues/23079
 */
const ActionsData = {
  onNewDoc: fn(),
};

const meta: Meta<typeof DocumentBrowser> = {
  title: 'Organisms/DocumentBrowser/DocumentBrowser',
  component: DocumentBrowser,
  args: {
    ...ActionsData,
    ...DocumentListItemStories.ActionsData,
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

export const Loading: Story = {
  args: {
    documents: [],
    loading: true,
  },
};

export const Empty: Story = {
  args: {
    ...Loading.args,
    loading: false,
  },
};
