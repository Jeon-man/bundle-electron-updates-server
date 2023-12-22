import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { path } from 'app-root-path';
import { WinstonModuleOptions, WinstonModuleOptionsFactory, utilities } from 'nest-winston';
import { format, transports } from 'winston';
import 'winston-daily-rotate-file';

@Injectable()
export class LoggerConfigService implements WinstonModuleOptionsFactory {
  constructor(private readonly config: ConfigService) {}

  createWinstonModuleOptions(): WinstonModuleOptions | Promise<WinstonModuleOptions> {
    const isProduction = this.config.get('NODE_ENV') === 'production';
    const level = isProduction ? 'info' : this.config.get('LOG_LEVEL');
    const logDir = path + '/logs';

    const fileFormat = format.combine(
      utilities.format.nestLike(this.config.get('APP_NAME'), {
        colors: false,
        prettyPrint: false,
      }),
      format.uncolorize(),
    );

    return {
      level,
      format: format.combine(format.splat(), format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' })),
      transports: [
        new transports.Console({
          format: format.combine(
            utilities.format.nestLike(this.config.get('APP_NAME'), {
              colors: true,
              prettyPrint: true,
            }),
          ),
        }),
        new transports.DailyRotateFile({
          level: 'info',
          datePattern: 'YYYY-MM-DD',
          dirname: `${logDir}/info`,
          filename: `%DATE%.log`,
          maxFiles: 30,
          json: false,
          zippedArchive: true,
          format: fileFormat,
        }),
        new transports.DailyRotateFile({
          level: 'error',
          datePattern: 'YYYY-MM-DD',
          dirname: `${logDir}/error`,
          filename: `%DATE%.error.log`,
          maxFiles: 30,
          handleExceptions: true,
          json: false,
          zippedArchive: true,
          format: fileFormat,
        }),
        new transports.DailyRotateFile({
          level: 'verbose',
          datePattern: 'YYYY-MM-DD',
          dirname: `${logDir}/debug`,
          filename: `%DATE%.log`,
          maxFiles: 5,
          json: true,
          zippedArchive: true,
          format: fileFormat,
        }),
      ],
    };
  }
}
