import fs from 'fs';
import detectIndent from 'detect-indent';

export const DEFAULT_INDENT = '  '; // two spaces

export function readJsonFile(path: string) {
  const file = fs.readFileSync(path, 'utf8') || '{}';
  const indent = detectIndent(path).indent || DEFAULT_INDENT;
  return {
    path,
    json: JSON.parse(file),
    indent,
  };
}
