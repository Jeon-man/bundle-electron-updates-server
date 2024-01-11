import { ApiProperty } from '@nestjs/swagger';
import { BINARY_UUID } from '@util/sequelize/types';
import { UUID2Hex } from '@util/uuid';
import appRootPath from 'app-root-path';
import { createReadStream } from 'fs';
import pathModule from 'path';
import { InferAttributes, InferCreationAttributes } from 'sequelize';
import { Column, ForeignKey, Model, Table } from 'sequelize-typescript';
import { BundleManifest } from './bundle.manifest.model';

@Table({
  tableName: 'Bundle',
  modelName: 'Bundle',
  timestamps: true,
  paranoid: true,
  indexes: [{ name: 'asset_unique_key', unique: true, fields: ['manifestId', 'hash'] }],
})
export class BundleAsset extends Model<
  InferAttributes<BundleAsset>,
  InferCreationAttributes<BundleAsset>
> {
  @ApiProperty({
    description: 'manifestId',
  })
  @ForeignKey(() => BundleManifest)
  @Column
  manifestId: number;

  @ApiProperty({
    description: 'Bundle asset hash key',
  })
  @Column(BINARY_UUID())
  uuid: string;

  @ApiProperty({
    description: 'file.buffer hash value',
  })
  @Column
  hash: string;

  @ApiProperty({
    description: 'Path where the asset is stored',
  })
  @Column
  path: string;

  @ApiProperty({
    description: 'Asset file mime type',
  })
  @Column({
    defaultValue: 'application/javascript',
  })
  contentType?: string;

  toStream() {
    return createReadStream(pathModule.resolve(appRootPath.path, 'bundle', UUID2Hex(this.uuid)));
  }

  toResponse(host: string) {
    return {
      uuid: UUID2Hex(this.uuid),
      hash: this.hash,
      path: this.path,
      url: `${host}/${this.uuid}`,
    };
  }
}
