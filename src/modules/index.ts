// @index(['./*', '!./index.ts', '!./*.(spec|test).ts'], f => `export * from '${f.path}';`)
export * from './app';
// @endindex

import * as Modules from './modules';

export { Modules };
