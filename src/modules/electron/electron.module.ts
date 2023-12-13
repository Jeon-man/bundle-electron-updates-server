import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';

import * as M from './models';
import { isModelClass } from '@util/sequelize';
import { ElectronService } from './electron.service';
import { ElectronController } from './electron.controller';
import { GithubModule } from '@module/github';
const models = Object.values(M).filter(isModelClass);

@Module({
  imports: [SequelizeModule.forFeature(models), GithubModule],
  providers: [ElectronService],
  controllers: [ElectronController],
  exports: [SequelizeModule],
})
export class ElectronModule {}

export default ElectronModule;
