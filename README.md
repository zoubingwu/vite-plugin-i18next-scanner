# vite-plugin-i18next-scanner

Automatically find and export translation keys when editing.

## Usage

Add this plugin to your `vite.config.js`:

```typescript
import { defineConfig } from 'vite';
import { i18nextScanner } from 'vite-plugin-i18next-scanner';

export default defineConfig({
  plugins: [
    //...
    i18nextScanner({
      langs: ['en', 'zh'],
    }),
  ],
});
```

### Options

```typescript
export interface PluginOptions {
  // Language files to be generated. default is [`en`]
  langs?: string[];
  
  // Files to be scanned, support glob pattern. default is `[./src/**/*.{ts,tsx,js,jsx}]`
  includes?: string[];
  
  // it will generate `{langs}.json` files under `outDir`, default is `./locales`
  outDir?: string;
}
```
