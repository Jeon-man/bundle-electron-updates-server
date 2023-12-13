import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { ElectronManifest } from './models';
import { ManifestQueryDto } from '@util/common';
import { ElectronPlatform } from './electron.types';

@Injectable()
export class ElectronService {
  constructor(
    @InjectModel(ElectronManifest)
    private readonly electronManifestRepo: typeof ElectronManifest,
  ) {}

  async getElectronManifest({
    runtimeVersion,
    releaseName,
    platform,
  }: ManifestQueryDto<ElectronPlatform>) {
    return this.electronManifestRepo.findOne({
      where: { releaseName, platform, ...(runtimeVersion ? { runtimeVersion } : {}) },
      order: [['createdAt', 'desc']],
      rejectOnEmpty: new NotFoundException({
        message: `Cannot Find Manifest of runtimeVersion ${runtimeVersion}`,
        detail: { runtimeVersion },
      }),
    });
  }
}
