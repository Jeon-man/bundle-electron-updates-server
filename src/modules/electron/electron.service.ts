import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { ManifestQueryDto } from '@util/common';
import { createHash } from '@util/crypto';
import { hex2UUID } from '@util/uuid';
import { CreateManifestBody } from './electron.dto';
import { ElectronPlatform } from './electron.types';
import { GithubService } from './github';
import { ElectronManifest } from './models';

@Injectable()
export class ElectronService {
  constructor(
    @InjectModel(ElectronManifest)
    private readonly electronManifestRepo: typeof ElectronManifest,
    private readonly githubService: GithubService,
  ) {}

  private getManifestUuid(runtimeVersion: string) {
    const updateMetadataBuffer = Buffer.from(JSON.stringify(runtimeVersion));
    return hex2UUID(createHash(updateMetadataBuffer, 'sha256', 'hex'));
  }

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

  async createManifest({ runtimeVersion, releaseName, platform }: CreateManifestBody) {
    const isExist = await this.githubService.existRelease(runtimeVersion);
    if (!isExist) throw new BadRequestException('Cannot create a release which does not exist');

    const [manifest] = await this.electronManifestRepo.findOrCreate({
      where: {
        uuid: this.getManifestUuid(runtimeVersion),
        runtimeVersion,
        releaseName,
        platform,
      },
    });

    return manifest;
  }
}
