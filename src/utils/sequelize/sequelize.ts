import { ApiProperty } from '@nestjs/swagger';
import { Include, isNotNullable } from '@util/types';
import { ModelStatic } from 'sequelize';
import { Column, Model } from 'sequelize-typescript';
import { BINARY_UUID } from './types';

export class BaseManifestModel<TInferAttributes extends {}, TInferCreationAttributes extends {}>
  extends Model<TInferAttributes & IBaseManifest, TInferCreationAttributes & IBaseManifest>
  implements IBaseManifest
{
  readonly id: number;

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

  readonly createdAt: Date;
  readonly updatedAt: Date;
  readonly deletedAt?: Date | null;
}

interface IBaseManifest {
  id: number;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date | null;

  uuid: string;
  runtimeVersion: string;
  releaseName: string;
}

export const isModelClass = <T>(m: T): m is Include<T, ModelStatic<Model<any, any>>> =>
  isNotNullable(m) && (m as any).prototype instanceof Model;
