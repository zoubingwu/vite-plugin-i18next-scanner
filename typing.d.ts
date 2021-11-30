declare module 'i18next-scanner' {
  export function createStream(options: any): any;

  export class Parser {
    constructor(options: any);
    parseFuncFromString(code: string): void;
    parseTransFromString(code: string): void;
    parseAttrFromString(code: string): void;

    get(): Record<string, Record<string, string>>;
  }
}