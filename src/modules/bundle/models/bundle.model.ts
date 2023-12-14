import { BINARY_UUID } from '@util/sequelize/types';
import { InferAttributes, InferCreationAttributes } from 'sequelize';
import { Column, Model, Table } from 'sequelize-typescript';

@Table({
  tableName: 'Bundle',
  modelName: 'Bundle',
  timestamps: true,
  paranoid: true,
})
export class Bundle extends Model<InferAttributes<Bundle>, InferCreationAttributes<Bundle>> {
  @Column(BINARY_UUID())
  hash: string;

  @Column
  path: string;
}
