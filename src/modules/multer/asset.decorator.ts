import { UseInterceptors, applyDecorators } from '@nestjs/common';
import { DynamicAnyFileInterceptor } from './multer.interceptor';

export type ManifestType = 'expo' | 'bundle' | 'electron';

export const UploadAsset = (type: ManifestType) =>
  applyDecorators(UseInterceptors(DynamicAnyFileInterceptor(type)));
