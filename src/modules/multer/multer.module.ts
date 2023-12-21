import { ConfigModule } from '@nestjs/config';
import { MulterModule } from '@nestjs/platform-express';
import { MulterConfigService } from './multer.config.service';

export const MulterDynamicModule = MulterModule.registerAsync({
  imports: [ConfigModule],
  useClass: MulterConfigService,
});

export default MulterDynamicModule;
