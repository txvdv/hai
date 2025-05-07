import PrimeVue from 'primevue/config';
import Aura from '@primeuix/themes/aura';
import { definePreset } from '@primeuix/themes';

/**
 * Aura components and preset fields
 * https://github.com/primefaces/primeuix/blob/c12c2b3/packages/themes/src/presets/aura/index.ts
 */
const AuraTealPreset = definePreset(Aura, {
  semantic: {
    primary: {
      50: '{blue.50}',
      100: '{blue.100}',
      200: '{blue.200}',
      300: '{blue.300}',
      400: '{blue.400}',
      500: '{blue.500}',
      600: '{blue.600}',
      700: '{blue.700}',
      800: '{blue.800}',
      900: '{blue.900}',
      950: '{blue.950}',
    },
    formField: {
      paddingX: '0.75rem',
      paddingY: '0.5rem',
      sm: {
        fontSize: '0.875rem',
        paddingX: '0.625rem',
        paddingY: '0.375rem',
      },
      lg: {
        fontSize: '1.125rem',
        paddingX: '0.875rem',
        paddingY: '0.625rem',
      },
      borderRadius: '{border.radius.sm}',
      focusRing: {
        // width: '0',
        // style: 'none',
        // color: 'transparent',
        // offset: '0',
        // shadow: 'none',
      },
      transitionDuration: '{transition.duration}',
    },
  },
});

const AuraTheme = {
  preset: AuraTealPreset,
  options: {
    cssLayer: {
      name: 'primevue',
      order: 'base, primevue',
    },
    darkModeSelector: '.dark',
  },
};

export { PrimeVue as PrimeVueConfig };
export { AuraTheme as DefaultTheme };
