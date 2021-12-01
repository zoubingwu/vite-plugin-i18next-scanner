import fs from 'fs';
import { ViteDevServer } from 'vite';
import { Parser } from 'i18next-scanner';
import debug from 'debug';
import workerpool, { WorkerPool } from 'workerpool';

import { ScannerOptions, PluginOptions, normalizeOptions } from './options';
import path from 'path';
import { readJsonFile } from './fs';

const dbg = debug('vite-plugin-i18next-scanner:context');

export class Context {
  private server: ViteDevServer | null = null;
  private readonly scannerOptions: ScannerOptions;
  private readonly pluginOptions: PluginOptions;
  private pool: WorkerPool | null = null;

  public constructor(options: PluginOptions = {}) {
    this.pluginOptions = options;
    this.scannerOptions = normalizeOptions(options);
    dbg('scannerOptions: %o', this.scannerOptions);
  }

  public async startScanner(server: ViteDevServer) {
    if (this.server === server) {
      return;
    }

    if (this.pool) {
      this.pool.terminate();
    }

    this.server = server;
    this.pool = workerpool.pool(__dirname + '/worker.js', {
      minWorkers: 'max',
      maxWorkers: 1,
    });

    await this.scanAll();

    this.watch(server.watcher);
  }

  public async closeScanner() {
    await this.pool?.terminate();
  }

  private watch(watcher: fs.FSWatcher) {
    watcher.on('change', p => this.handleFileChange(p));
    watcher.on('unlink', p => this.handleFileUnlink(p));
  }

  private passExtensionCheck(p: string): boolean {
    const extname = path.extname(p);
    return (
      this.scannerOptions.options.func.extensions.includes(extname) ||
      this.scannerOptions.options.attr.extensions.includes(extname) ||
      this.scannerOptions.options.trans.extensions.includes(extname)
    );
  }

  private async handleFileUnlink(p: string) {
    if (this.passExtensionCheck(p)) {
      await this.scanAll();
    }
  }
  private async handleFileChange(p: string) {
    dbg(`scanning ${p}`);

    if (!this.passExtensionCheck(p)) {
      return;
    }

    const content = fs.readFileSync(p, 'utf8');
    const parser = new Parser(this.scannerOptions.options);

    if (!content) {
      return;
    }

    parser.parseFuncFromString(content);
    const translations = parser.get();

    const resourceFromFile = Object.keys(translations).reduce((acc, key) => {
      acc[key] = translations[key].translation;
      return acc;
    }, {} as { [key: string]: string });
    dbg('resource from file: %o', resourceFromFile);

    const hasKey = Object.keys(resourceFromFile).some(lang => {
      return Object.keys(resourceFromFile[lang]).length > 0;
    });

    if (!hasKey) {
      dbg('no key found');
      return;
    }

    let shouldScanAll = false;
    Object.keys(resourceFromFile).forEach(lang => {
      const languageResource = path.resolve(
        this.scannerOptions.options.resource.savePath.replace('{{lng}}', lang)
      );
      const { json } = readJsonFile(languageResource);
      if (Object.keys(resourceFromFile[lang]).some(key => !(key in json))) {
        shouldScanAll = true;
      }
    });

    if (shouldScanAll) {
      await this.scanAll();
    } else {
      dbg('no need to scan all');
    }
  }

  private async scanAll() {
    if (!this.pool) {
      return;
    }

    dbg('scanning and regenerating all resources...');
    const worker = await this.pool.proxy();

    await worker.scanAndGenerateResource(
      this.scannerOptions.input,
      this.scannerOptions.output,
      this.pluginOptions
    );

    dbg('done scanning and regenerating all resources');
  }
}
