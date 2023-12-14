// @index(['./*', '!./index.ts', '!./*.(spec|test).ts'], f => f.path.endsWith('.module') ? `import { default as Module } from '${f.path}';\nexport default Module;\nexport * from '${f.path}';` : `export * from '${f.path}';`)
export * from './electron.controller';
export * from './electron.dto';
export * from './electron.module';
export * from './electron.service';
export * from './electron.types';
export * from './github';
export * from './models';
import { default as Module } from './electron.module';
export default Module;
