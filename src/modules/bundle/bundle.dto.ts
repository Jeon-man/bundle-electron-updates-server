import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { FindOptions } from 'sequelize';
import { BundleMetadata, BundlePlatform } from './bundle.types';
import { BundleManifest } from './models';

export class CreateBundleBody {
  @IsString()
  @IsNotEmpty()
  releaseName: string;

  @IsString()
  @IsNotEmpty()
  runtimeVersion: string;

  @IsNotEmpty()
  metadata: BundleMetadata;

  @IsString()
  @IsNotEmpty()
  moduleFederationConfig: string;

  getPlatformMetadata() {
    return { ...this.metadata.platformMetadata };
  }
}

export class BundleManifestFindQuery {
  @IsString()
  @IsOptional()
  runtimeVersion: string;

  @IsEnum(BundlePlatform)
  @IsOptional()
  bundlePlatform: BundlePlatform;

  toFindOptions(): FindOptions<BundleManifest> {
    return {
      where: {
        ...(this.runtimeVersion ? { runtimeVersion: this.runtimeVersion } : {}),
        ...(this.bundlePlatform ? { bundlePlatform: this.bundlePlatform } : {}),
      },
    };
  }
}
