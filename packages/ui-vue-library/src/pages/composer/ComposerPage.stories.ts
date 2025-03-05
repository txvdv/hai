// noinspection JSUnusedGlobalSymbols

import type {Meta, StoryObj} from '@storybook/vue3';
// @ts-ignore
import ComposerPage from './ComposerPage.vue';

const meta: Meta<typeof ComposerPage> = {
  title: 'Pages/ComposerPage',
  component: ComposerPage,
  tags: ['!autodocs'],
  args: {},
  argTypes: {},
}
export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {}
};
