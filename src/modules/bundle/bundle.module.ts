import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';

import { isModelClass } from '@util/sequelize';
import { BundleController } from './bundle.controller';
import { BundleService } from './bundle.service';
import * as M from './models';

const models = Object.values(M).filter(isModelClass);

@Module({
  imports: [SequelizeModule.forFeature(models)],
  providers: [BundleService],
  controllers: [BundleController],
  exports: [SequelizeModule, BundleService],
})
export class BundleModule {}

export default BundleModule;
