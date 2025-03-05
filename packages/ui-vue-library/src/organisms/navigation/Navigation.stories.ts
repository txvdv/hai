// noinspection JSUnusedGlobalSymbols

import type {Meta, StoryObj} from '@storybook/vue3';
// @ts-ignore
import Navigation from './Navigation.vue';

const meta: Meta<typeof Navigation> = {
  title: 'Organisms/Navigation',
  component: Navigation,
  args: {},
  argTypes: {},
}
export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    items: [{
      text: 'HAI',
      link: '/'
    }, {
      text: 'Dashboard',
      link: '/dashboard'
    }, {
      text: 'Composer',
      link: '/composer'
    }, {
      text: 'Design',
      link: '/design'
    }]
  },
};
