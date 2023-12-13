// @index(['./*', '!./index.ts', '!./*.(spec|test).ts'], f => `export * from '${f.path}';`)
export * from './app';
export * from './config';
// @endindex

import * as Modules from './modules';

export { Modules };
