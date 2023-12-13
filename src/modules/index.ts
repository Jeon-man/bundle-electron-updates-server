// @index(['./*', '!./index.ts', '!./*.(spec|test).ts'], f => `export * from '${f.path}';`)
export * from './app';
export * from './config';
export * from './db';
export * from './electron';
export * from './github';
export * from './modules';
// @endindex

import * as Modules from './modules';

export { Modules };
