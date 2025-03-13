// noinspection JSUnusedGlobalSymbols

import type { Meta, StoryObj } from '@storybook/vue3';
// @ts-ignore
import DocumentTimeline from './DocumentTimeline.vue';

const meta: Meta<typeof DocumentTimeline> = {
  title: 'Organisms/DocumentTimeline/DocumentTimeline',
  component: DocumentTimeline,
};
export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {},
};
