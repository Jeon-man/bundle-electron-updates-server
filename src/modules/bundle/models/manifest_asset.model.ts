import { BelongsTo, Column, ForeignKey, PrimaryKey, Table } from 'sequelize-typescript';
import { BundleAsset } from './bundle.asset.model';
import { BundleManifest } from './bundle.manifest.model';

@Table({
  tableName: 'BundleManifest_Asset',
  modelName: 'BundleManifest_Asset',
  timestamps: true,
  paranoid: true,
})
export class BundleManifest_Asset {
  @PrimaryKey
  @ForeignKey(() => BundleManifest)
  @Column
  bundleManifestId: number;

  @BelongsTo(() => BundleManifest)
  bundleManifest?: BundleManifest;

  @PrimaryKey
  @ForeignKey(() => BundleAsset)
  @Column
  bundleAssetId: number;

  @BelongsTo(() => BundleAsset)
  bundleAsset?: BundleAsset;
}
