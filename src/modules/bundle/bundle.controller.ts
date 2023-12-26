import { UploadAsset } from '@module/multer';
import { Body, Controller, Get, Param, Post, Query, UploadedFiles } from '@nestjs/common';
import { InjectConnection, InjectModel } from '@nestjs/sequelize';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { Sequelize } from 'sequelize-typescript';
import { BundleManifestFindQuery, CreateBundleBody } from './bundle.dto';
import { BundleService } from './bundle.service';
import { BundleManifest } from './models';

@ApiTags('bundle')
@Controller('bundle')
export class BundleController {
  constructor(
    @InjectConnection() private readonly sequelize: Sequelize,
    @InjectModel(BundleManifest) private readonly bundleManifestRepo: typeof BundleManifest,
    private readonly bundleService: BundleService,
  ) {}

  @ApiOperation({
    summary: 'get latest bundle manifest',
  })
  @Get('manifests/release/:releaseName/latest')
  async getLatestBundleManifestByReleaseName(
    @Param('releaseName') releaseName: string,
    @Query() query: BundleManifestFindQuery,
  ) {
    return this.bundleManifestRepo.findOne({
      where: {
        releaseName,
      },
      include: [
        { association: BundleManifest.associations.assets },
        { association: BundleManifest.associations.bundleManifest_asset },
      ],
      order: [['createdAt', 'desc']],
      ...query.toFindOptions(),
    });
  }

  @ApiOperation({
    summary: 'create bundle manifest with assets',
  })
  @UploadAsset('bundle')
  @Post('upload')
  async createBundle(
    @UploadedFiles()
    bundleFiles: Express.Multer.File[],
    @Body() bundleData: CreateBundleBody,
  ) {
    /** @todo Define swagger body on this*/
    await this.sequelize.transaction(async () => {
      await this.bundleService.createBundle(bundleFiles, bundleData);
    });
  }
}
