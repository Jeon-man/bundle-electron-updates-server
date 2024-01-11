import { ApiProperty } from '@nestjs/swagger';
import { BaseManifestModel } from '@util/sequelize';
import { JSON_STRING } from '@util/sequelize/types';
import {
  BelongsTo as BelongsToAssociation,
  CreationAttributes,
  HasMany as HasManyToAssociation,
} from 'sequelize';
import { BelongsTo, Column, DataType, ForeignKey, HasMany, Table } from 'sequelize-typescript';
import { BundlePlatform, BundlePlatformList, Bundler, RemoteConfig } from '../bundle.types';
import { BundleAsset } from './bundle.asset.model';

@Table({
  tableName: 'BundleManifest',
  modelName: 'BundleManifest',
  timestamps: true,
  paranoid: true,
})
export class BundleManifest
  extends BaseManifestModel<BundleManifestAttributes, BundleManifestCreationAttributes>
  implements IBundleManifest
{
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
    description: 'Module have remote config',
  })
  @Column(JSON_STRING(DataType.TEXT))
  remotes: RemoteConfig[];

  @ApiProperty({
    description: 'Bundle typescript index json asset',
  })
  @ForeignKey(() => BundleAsset)
  @Column({
    allowNull: true,
  })
  typeIndexJsonId?: number;

  @BelongsTo(() => BundleAsset)
  typeIndexJson?: BundleAsset;

  @HasMany(() => BundleAsset)
  assets?: BundleAsset[];

  declare static associations: {
    typeIndexJson: BelongsToAssociation<BundleManifest, BundleAsset>;
    assets: HasManyToAssociation<BundleManifest, BundleAsset>;
  };
}

interface IBundleManifest {
  platform: BundlePlatform;
  remotes: RemoteConfig[];
  typeIndexJsonId?: number;
  typeIndexJson?: BundleAsset;
  assets?: BundleAsset[];
}

interface BundleManifestAttributes
  extends Omit<IBundleManifest, 'typeIndexJson' | 'assets' | 'bundleManifest_asset'> {}

interface BundleManifestCreationAttributes
  extends Omit<BundleManifestAttributes, 'id' | `${string}At`> {
  typeIndexJson?: CreationAttributes<BundleAsset>;
  assets?: CreationAttributes<BundleAsset>[];
}
