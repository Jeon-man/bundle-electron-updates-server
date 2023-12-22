// @index(['./*', '!./index.ts', '!./*.(spec|test).ts'], f => f.path.endsWith('.module') ? `import { default as Module } from '${f.path}';\nexport default Module;\nexport * from '${f.path}';` : `export * from '${f.path}';`)
export * from './asset.decorator';
export * from './multer.config.service';
export * from './multer.interceptor';
export * from './multer.module';
import { default as Module } from './multer.module';
export default Module;
