import { ConfigModule } from '@nestjs/config';
import { WinstonModule } from 'nest-winston';
import { LoggerConfigService } from './logger.service';

export const LoggerDynamicModule = WinstonModule.forRootAsync({
  imports: [ConfigModule],
  useClass: LoggerConfigService,
});

export default LoggerDynamicModule;
