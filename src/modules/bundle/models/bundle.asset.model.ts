import { ApiProperty } from '@nestjs/swagger';
import { BINARY_UUID } from '@util/sequelize/types';
import { InferAttributes, InferCreationAttributes } from 'sequelize';
import { Column, Model, Table } from 'sequelize-typescript';

@Table({
  tableName: 'Bundle',
  modelName: 'Bundle',
  timestamps: true,
  paranoid: true,
})
export class BundleAsset extends Model<
  InferAttributes<BundleAsset>,
  InferCreationAttributes<BundleAsset>
> {
  @ApiProperty({
    description: 'Bundle asset hash key',
  })
  @Column(BINARY_UUID())
  uuid: string;

  @ApiProperty({
    description: 'file.buffer hash value',
  })
  hash: string;

  @ApiProperty({
    description: 'Path where the asset is stored',
  })
  @Column
  path: string;
}
