import path from 'path';
import { defaults, defaultsDeep } from 'lodash';

export const defaultOptions = {
  input: ['src/**/*.{js,jsx,ts,tsx}'],
  output: './',
  options: {
    debug: false,
    removeUnusedKeys: true,
    sort: true,
    attr: {
      list: ['data-i18n'],
      extensions: ['.html', '.htm'],
    },
    func: {
      list: ['t', 'i18next.t', 'i18n.t'],
      extensions: ['.ts', '.tsx', '.js', '.jsx'],
    },
    trans: {
      component: 'Trans',
      i18nKey: 'i18nKey',
      defaultsKey: 'defaults',
      extensions: [] as string[],
      fallbackKey: false,
    },
    lngs: ['en'],
    defaultLng: 'en',
    defaultValue: function (_: string, __: string, key: string) {
      return key;
    },
    resource: {
      loadPath: './locales/{{lng}}.json',
      savePath: './locales/{{lng}}.json',
      jsonIndent: 2,
      lineEnding: '\n',
    },
    nsSeparator: ':',
    keySeparator: '.',
    pluralSeparator: '_',
    contextSeparator: '_',
    contextDefaultValues: [],
    interpolation: {
      prefix: '{{',
      suffix: '}}',
    },
  },
};

export type ScannerOptions = typeof defaultOptions;

export const defaultPluginOptions: PluginOptions = {
  langs: ['en'],
  outDir: 'locales',
  includes: ['src/**/*.{js,jsx,ts,tsx}'],
};

export interface PluginOptions {
  includes?: string[];
  outDir?: string;
  langs?: string[];
}

export function mergePluginOptionToScannerOption(
  a: ScannerOptions,
  b: PluginOptions
) {
  const o = defaults(b, defaultPluginOptions) as Required<PluginOptions>;
  a.input = o.includes;
  a.options.lngs = o.langs;
  a.options.resource.savePath = path.join(o.outDir, '{{lng}}.json');
  a.options.resource.loadPath = path.join(o.outDir, '{{lng}}.json');

  return a;
}

export function normalizeOptions(o: PluginOptions = {}) {
  const options = defaultsDeep({}, defaultOptions);
  return mergePluginOptionToScannerOption(options, o);
}
