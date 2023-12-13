import { InferAttributes, InferCreationAttributes } from 'sequelize';
import { Column, Model } from 'sequelize-typescript';
import { ApiProperty } from '@nestjs/swagger';

export class BaseManifestModel<T extends Model> extends Model<
  InferAttributes<T>,
  InferCreationAttributes<T>
> {
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
