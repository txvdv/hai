import type {Meta, StoryObj} from '@storybook/vue3';
// @ts-ignore
import Footer from './Footer.vue';

const meta: Meta<typeof Footer> = {
  title: 'Organisms/Footer',
  tags: ['!autodocs'],
  component: Footer,
}
export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};
