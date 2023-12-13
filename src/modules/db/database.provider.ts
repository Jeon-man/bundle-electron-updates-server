import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { SequelizeModuleOptions, SequelizeOptionsFactory } from '@nestjs/sequelize';

@Injectable()
export class DatabaseProvider implements SequelizeOptionsFactory {
  constructor(private readonly config: ConfigService) {}

  createSequelizeOptions(): SequelizeModuleOptions | Promise<SequelizeModuleOptions> {
    const isProduction = this.config.get('NODE_ENV') === 'production';

    const dialect = this.config.get('DB_DIALECT');
    const host = this.config.get<string>('DB_HOST');
    const port = this.config.get<number>('DB_PORT');
    const username = this.config.get<string>('DB_USERNAME');
    const database = this.config.get<string>('DB_DATABASE');
    const password = this.config.get<string>('DB_PASSWORD');

    return {
      dialect,
      host,
      port,
      username,
      password,
      database,

      models: [],

      logging: !isProduction
        ? (sql: string, time: any) => {
            Logger.debug(
              sql.replace('Executed', `Executed [${time}ms]`),
              'DatabaseProvider(default)',
            );
          }
        : false,
      logQueryParameters: !isProduction,
      benchmark: !isProduction,
      timezone: '+09:00',
      dialectOptions: {
        supportBigNumbers: true,
        bigNumberStrings: true,
      },

      pool: {
        max: 50,
        min: 0,
        acquire: 30000,
        idle: 10000,
      },

      autoLoadModels: true,
    };
  }
}
