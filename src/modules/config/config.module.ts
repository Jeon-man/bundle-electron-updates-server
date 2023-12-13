import { ConfigModule as OriginalConfigModule } from '@nestjs/config';

import { validateConfig } from './env.validator';

export const ConfigModule = OriginalConfigModule.forRoot({
  envFilePath: [`.env.${process.env.NODE_ENV || 'development'}`, '.env'],
  isGlobal: true,
  validate: validateConfig,
});

export default ConfigModule;
