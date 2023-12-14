import { InferAttributes, InferCreationAttributes } from 'sequelize';
import { Model, Table } from 'sequelize-typescript';

@Table({
  tableName: 'Bundle',
  modelName: 'Bundle',
  timestamps: true,
  paranoid: true,
})
export class Bundle extends Model<InferAttributes<Bundle>, InferCreationAttributes<Bundle>> {}
