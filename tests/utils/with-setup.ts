import { createApp } from 'vue';

export const withSetup = (composable: () => any) => {
  let results: any;

  const app = createApp({
    setup() {
      results = composable();

      return () => {};
    },
  });

  app.mount(document.createElement('div'));

  return [results, app] as const;
};
