// noinspection JSUnusedGlobalSymbols

import type {Meta, StoryObj} from '@storybook/vue3';
import { fn } from '@storybook/test';
// @ts-ignore
import DocumentListItem from './DocumentListItem.vue';
import {FakeDocumentBrowserState} from "./DocumentBrowser.state";

/**
 * Issue: Vue3 Automatic inference argTypes don't work well
 * https://github.com/storybookjs/storybook/issues/23079
 */
export const ActionsData = {
  onDeleteDoc: fn(),
  onEditDoc: fn(),
  onViewDoc: fn(),
};

const meta: Meta<typeof DocumentListItem> = {
  title: 'Organisms/DocumentBrowser/DocumentListItem',
  component: DocumentListItem,
  excludeStories: /.*Data$/,
  args: {
    ...ActionsData,
    document: FakeDocumentBrowserState.documents[0]
  },
  argTypes: {
  }
}
export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    document: FakeDocumentBrowserState.documents[0]
  }
};
