import { BaseManifestModel } from '@util/sequelize/sequelize';
import { Column, Table } from 'sequelize-typescript';
import { ElectronPlatform } from '../electron.types';

@Table({
  tableName: 'ElectronManifest',
  modelName: 'ElectronManifest',
  timestamps: true,
  paranoid: true,
})
export class ElectronManifest extends BaseManifestModel<ElectronManifest> {
  @Column
  platform: ElectronPlatform;
}
