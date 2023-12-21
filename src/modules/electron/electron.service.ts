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

  private getManifestUuid(version: string) {
    const updateMetadataBuffer = Buffer.from(JSON.stringify(version));
    return hex2UUID(createHash(updateMetadataBuffer, 'sha256', 'hex'));
  }

  async getElectronManifest({
    version,
    releaseName,
    platform,
  }: ManifestQueryDto<ElectronPlatform>) {
    return this.electronManifestRepo.findOne({
      where: { releaseName, platform, ...(version ? { version } : {}) },
      order: [['createdAt', 'desc']],
      rejectOnEmpty: new NotFoundException({
        message: `Cannot Find Manifest of version ${version}`,
        detail: { version },
      }),
    });
  }

  async createManifest({ version, releaseName, platform }: CreateManifestBody) {
    const isExist = await this.githubService.existRelease(version);
    if (!isExist) throw new BadRequestException('Cannot create a release which does not exist');

    const [manifest] = await this.electronManifestRepo.findOrCreate({
      where: {
        uuid: this.getManifestUuid(version),
        version,
        releaseName,
        platform,
      },
    });

    return manifest;
  }
}
