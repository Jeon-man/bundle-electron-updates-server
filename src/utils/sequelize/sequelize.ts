import { ApiProperty } from '@nestjs/swagger';
import { Include, isNotNullable } from '@util/types';
import { InferAttributes, InferCreationAttributes, ModelStatic } from 'sequelize';
import { Column, Model } from 'sequelize-typescript';
import { BINARY_UUID } from './types';

export class BaseManifestModel<T extends Model> extends Model<
  InferAttributes<T>,
  InferCreationAttributes<T>
> {
  @ApiProperty({
    description: 'manifest uuid',
  })
  @Column(BINARY_UUID())
  uuid: string;

  @ApiProperty({
    description: 'manifest version',
  })
  @Column
  runtimeVersion: string;

  @ApiProperty({
    description: 'manifest releaseName',
  })
  @Column
  releaseName: string;
}

export const isModelClass = <T>(m: T): m is Include<T, ModelStatic<Model<any, any>>> =>
  isNotNullable(m) && (m as any).prototype instanceof Model;
