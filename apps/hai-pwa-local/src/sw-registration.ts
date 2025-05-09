// https://developer.mozilla.org/en-US/docs/Web/API/Service_Worker_API#registration
// https://vite-pwa-org.netlify.app/guide/development.html#injectmanifest-strategy

if ('serviceWorker' in navigator) {
  window.addEventListener('load', async () => {
    try {
      const registration = await navigator.serviceWorker.register(
        import.meta.env.MODE === 'production' ? '/sw.js' : '/dev-sw.js?dev-sw',
        { type: import.meta.env.MODE === 'production' ? 'classic' : 'module' }
      );
      console.log('Service Worker registered successfully with scope:', registration.scope);
    } catch (error) {
      console.error('Service Worker registration failed:', error);
    }
  });
}