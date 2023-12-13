import { IsOptional } from 'class-validator';

export class ManifestQueryDto<T> {
  @IsOptional()
  platform: T;

  @IsOptional()
  runtimeVersion?: string;

  @IsOptional()
  releaseName: string;
}
