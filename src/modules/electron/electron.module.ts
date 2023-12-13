import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';

import { isModelClass } from '@util/sequelize';
import { ElectronController } from './electron.controller';
import { ElectronService } from './electron.service';
import { GithubModule } from './github';
import * as M from './models';

const models = Object.values(M).filter(isModelClass);

@Module({
  imports: [SequelizeModule.forFeature(models), GithubModule],
  providers: [ElectronService],
  controllers: [ElectronController],
  exports: [SequelizeModule],
})
export class ElectronModule {}

export default ElectronModule;
