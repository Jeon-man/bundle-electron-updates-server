import { BaseManifestModel } from '@util/sequelize';
import { Table } from 'sequelize-typescript';

@Table({
  tableName: 'BundleManifest',
  modelName: 'BundleManifest',
  timestamps: true,
  paranoid: true,
})
export class BundleManifest extends BaseManifestModel<BundleManifest> {}
