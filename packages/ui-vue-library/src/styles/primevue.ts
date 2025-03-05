import PrimeVue from "primevue/config";
import Aura from '@primeuix/themes/aura';
import { definePreset } from '@primeuix/themes';

const AuraTealPreset = definePreset(Aura, {
  semantic: {
    primary: {
      50: '{teal.50}',
      100: '{teal.100}',
      200: '{teal.200}',
      300: '{teal.300}',
      400: '{teal.400}',
      500: '{teal.500}',
      600: '{teal.600}',
      700: '{teal.700}',
      800: '{teal.800}',
      900: '{teal.900}',
      950: '{teal.950}'
    },
    formField: {
      paddingX: "0.75rem",
      paddingY: "0.5rem",
      sm: {
        fontSize: "0.875rem",
        paddingX: "0.625rem",
        paddingY: "0.375rem"
      },
      lg: {
        fontSize: "1.125rem",
        paddingX: "0.875rem",
        paddingY: "0.625rem"
      },
      borderRadius: "{border.radius.sm}",
      focusRing: {
        width: "0",
        style: "none",
        color: "transparent",
        offset: "0",
        shadow: "none"
      },
      transitionDuration: "{transition.duration}"
    },
  }
});

const AuraTheme = {
  preset: AuraTealPreset,
  options: {
    cssLayer: {
      name: 'primevue',
      order: 'base, primevue'
    },
    darkModeSelector: '.dark',
  }
}

export {PrimeVue as PrimeVueConfig}
export {AuraTheme as DefaultTheme}