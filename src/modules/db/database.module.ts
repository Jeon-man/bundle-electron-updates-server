import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { DatabaseProvider } from './database.provider';

@Module({
  imports: [
    SequelizeModule.forRootAsync({
      useClass: DatabaseProvider,
    }),
  ],
  exports: [SequelizeModule],
})
export class DataBaseModule {}

export default DataBaseModule;
