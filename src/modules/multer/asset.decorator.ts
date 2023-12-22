import { UseInterceptors, applyDecorators } from '@nestjs/common';
import { DynamicAnyFileInterceptor } from './multer.interceptor';

export type MulterPathType = 'expo' | 'bundle' | 'electron';

export const UploadAsset = (type: MulterPathType) =>
  applyDecorators(UseInterceptors(DynamicAnyFileInterceptor(type)));
