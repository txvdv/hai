import type {Meta, StoryObj} from '@storybook/vue3';
// @ts-ignore
import Library from './Library.vue';

const meta: Meta<typeof Library> = {
  title: 'Organisms/Library',
  tags: ['!autodocs'],
  component: Library,
}
export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};
