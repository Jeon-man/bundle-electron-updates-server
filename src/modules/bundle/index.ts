// @index(['./*', '!./index.ts', '!./*.(spec|test).ts'], f => f.path.endsWith('.module') ? `import { default as Module } from '${f.path}';\nexport default Module;\nexport * from '${f.path}';` : `export * from '${f.path}';`)
export * from './bundle.controller';
export * from './bundle.module';
export * from './bundle.service';
export * from './bundle.types';
export * from './models';
import { default as Module } from './bundle.module';
export default Module;
