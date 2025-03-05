import PrimeVue from "primevue/config";
import Aura from '@primeuix/themes/aura';
import { definePreset } from '@primeuix/themes';

const AuraIndigoPreset = definePreset(Aura, {
  semantic: {
    primary: {
      50: '{indigo.50}',
      100: '{indigo.100}',
      200: '{indigo.200}',
      300: '{indigo.300}',
      400: '{indigo.400}',
      500: '{indigo.500}',
      600: '{indigo.600}',
      700: '{indigo.700}',
      800: '{indigo.800}',
      900: '{indigo.900}',
      950: '{indigo.950}'
    }
  }
});

const AuraTheme = {
  preset: AuraIndigoPreset,
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