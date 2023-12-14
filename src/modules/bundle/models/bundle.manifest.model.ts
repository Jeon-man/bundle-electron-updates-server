import { ApiProperty } from '@nestjs/swagger';
import { BaseManifestModel } from '@util/sequelize';
import { JSON_STRING } from '@util/sequelize/types';
import { Column, DataType, Table } from 'sequelize-typescript';
import {
  BundlePlatform,
  BundlePlatformList,
  Bundler,
  ModuleFederationConfig,
} from '../bundle.types';

@Table({
  tableName: 'BundleManifest',
  modelName: 'BundleManifest',
  timestamps: true,
  paranoid: true,
})
export class BundleManifest extends BaseManifestModel<BundleManifest> {
  @ApiProperty({
    description: 'bundler type',
    example: 'webpack',
  })
  @Column({
    type: DataType.STRING,
  })
  bundler: Bundler;

  @ApiProperty({
    description: 'bundler platform',
    example: 'ios',
  })
  @Column({
    type: DataType.ENUM(...BundlePlatformList),
  })
  platform: BundlePlatform;

  @ApiProperty({
    description: 'Module have federation config',
  })
  @Column(JSON_STRING(DataType.TEXT))
  moduleFederationConfig: ModuleFederationConfig;
}
