import type { Plugin } from 'vite';

import { Context } from './context';
import { PluginOptions } from './options';

export { PluginOptions };

export function i18nextScanner(options?: PluginOptions): Plugin {
  const ctx = new Context(options);

  return {
    name: 'vite-plugin-i18next-scanner',
    async configureServer(server) {
      await ctx.configureServer(server);
    },
  };
}
