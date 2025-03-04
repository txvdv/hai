import {setup} from "@storybook/vue3"
import type {Preview} from "@storybook/vue3"
import {themes} from '@storybook/theming';
import PrimeVue from 'primevue/config';
import Aura from '@primeuix/themes/aura';

const preview: Preview = {
  // Enables auto-generated documentation for all stories
  // @see https://storybook.js.org/docs/writing-docs/autodocs
  tags: ['autodocs'],
  parameters: {
    darkMode: {
      dark: {
        ...themes.dark,
        appBg: 'black',
        appPreviewBg: 'black',
      },
      darkClass: 'dark',
      stylePreview: true
    },
    layout: 'fullscreen'
  }
}

setup((app) => {
  app.use(PrimeVue, {
    theme: {
      preset: Aura
    }
  })
})

export default preview;