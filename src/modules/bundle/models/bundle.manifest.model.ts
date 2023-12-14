import { ApiProperty } from '@nestjs/swagger';
import { BaseManifestModel } from '@util/sequelize';
import { JSON_STRING } from '@util/sequelize/types';
import { Column, DataType, Table } from 'sequelize-typescript';
import { Bundler, ModuleFederationConfig } from '../bundle.types';

@Table({
  tableName: 'BundleManifest',
  modelName: 'BundleManifest',
  timestamps: true,
  paranoid: true,
})
export class BundleManifest extends BaseManifestModel<BundleManifest> implements BundleManifest {
  @ApiProperty({
    description: 'bundler type',
    example: 'web',
  })
  @Column({
    type: DataType.STRING,
  })
  bundler: Bundler;

  @Column(JSON_STRING(DataType.TEXT))
  moduleFederationConfig: ModuleFederationConfig;
}
