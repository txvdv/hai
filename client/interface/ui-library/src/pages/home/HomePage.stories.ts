// noinspection JSUnusedGlobalSymbols

import type {Meta, StoryObj} from '@storybook/vue3';
// @ts-ignore
import HomePage from './HomePage.vue';

const meta: Meta<typeof HomePage> = {
  title: 'Pages/Home',
  component: HomePage,
  tags: ['!autodocs'],
  args: {},
  argTypes: {},
}
export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {}
};
