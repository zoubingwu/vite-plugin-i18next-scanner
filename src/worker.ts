import workerpool from 'workerpool';
import vfs from 'vinyl-fs';
import { createStream } from 'i18next-scanner';

import { normalizeOptions, PluginOptions } from './options';

async function scanAndGenerateResource(
  input: string[],
  output: string,
  options: PluginOptions
) {
  const scannerOptions = normalizeOptions(options);

  return new Promise<void>((resolve, reject) => {
    vfs
      .src(input)
      .pipe(createStream(scannerOptions.options))
      .pipe(vfs.dest(output))
      .on('finish', () => resolve())
      .on('error', (e: any) => reject(e));
  });
}

workerpool.worker({
  scanAndGenerateResource,
});
