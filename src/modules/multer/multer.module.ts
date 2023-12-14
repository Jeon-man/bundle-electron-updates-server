import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MulterModule } from '@nestjs/platform-express';
import { MulterConfigService } from './multer.config.service';

@Module({
  imports: [
    MulterModule.registerAsync({
      imports: [ConfigModule],
      useExisting: MulterConfigService,
    }),
  ],
  exports: [MulterModule],
})
export class MulterDynamicModule {}

export default MulterDynamicModule;
