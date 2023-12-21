import { IsOptional } from 'class-validator';

export class ManifestQueryDto<T> {
  @IsOptional()
  platform: T;

  @IsOptional()
  version?: string;

  @IsOptional()
  releaseName: string;
}
