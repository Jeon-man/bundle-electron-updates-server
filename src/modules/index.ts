// @index(['./*', '!./index.ts', '!./*.(spec|test).ts'], f => `export * from '${f.path}';`)
export * from './app';
export * from './config';
export * from './db';
// @endindex

import * as Modules from './modules';

export { Modules };
