import { IsNotEmpty, IsString } from 'class-validator';
import { BundleMetadata } from './bundle.types';

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
