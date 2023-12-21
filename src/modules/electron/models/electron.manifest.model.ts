import { BaseManifestModel } from '@util/sequelize';
import { Column, Table } from 'sequelize-typescript';
import { ElectronPlatform } from '../electron.types';

@Table({
  tableName: 'ElectronManifest',
  modelName: 'ElectronManifest',
  timestamps: true,
  paranoid: true,
})
export class ElectronManifest extends BaseManifestModel<
  BundleManifestAttributes,
  BundleManifestCreationAttributes
> {
  @Column
  platform: ElectronPlatform;
}

interface IElectronManifest {
  id: number;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date | null;

  platform: ElectronPlatform;
}

interface BundleManifestAttributes extends Omit<IElectronManifest, ''> {}

interface BundleManifestCreationAttributes
  extends Omit<BundleManifestAttributes, 'id' | `${string}At`> {}
