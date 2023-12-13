// @index(['./*', '!./index.ts', '!./*.(spec|test).ts'], f => f.path.endsWith('.module') ? `import { default as Module } from '${f.path}';\nexport default Module;\nexport * from '${f.path}';` : `export * from '${f.path}';`)
import { default as Module } from './database.module';
export default Module;
export * from './database.module';
export * from './database.provider';
