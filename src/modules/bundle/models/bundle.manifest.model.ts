import { ApiProperty } from '@nestjs/swagger';
import { BaseManifestModel } from '@util/sequelize';
import { JSON_STRING } from '@util/sequelize/types';
import {
  BelongsToMany as BelongsToManyAssociation,
  HasMany as HasManyAssociation,
} from 'sequelize';
import { BelongsToMany, Column, DataType, HasMany, Table } from 'sequelize-typescript';
import {
  BundlePlatform,
  BundlePlatformList,
  Bundler,
  ModuleFederationConfig,
} from '../bundle.types';
import { BundleAsset } from './bundle.asset.model';
import { BundleManifest_Asset } from './manifest_asset.model';

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

  @BelongsToMany(() => BundleAsset, () => BundleManifest_Asset)
  assets?: BundleAsset[];

  @HasMany(() => BundleManifest_Asset)
  bundleManifest_asset: BundleManifest_Asset[];

  declare static associations: {
    assets: BelongsToManyAssociation<BundleManifest, BundleAsset>;
    bundleManifest_asset: HasManyAssociation<BundleManifest, BundleManifest_Asset>;
  };
}
