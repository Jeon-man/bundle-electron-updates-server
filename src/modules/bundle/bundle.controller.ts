import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { AnyFilesInterceptor } from '@nestjs/platform-express';
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
    @Param('ReleaseName') releaseName: string,
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
  @UseInterceptors(AnyFilesInterceptor())
  @Post('upload')
  async createBundle(
    @UploadedFiles()
    bundleFiles: Record<'assets', Express.Multer.File[]> &
      Partial<Record<'types', Express.Multer.File[]>> &
      Partial<Record<'typeIndexJson', Express.Multer.File>>,
    @Body() bundleData: CreateBundleBody,
  ) {
    await this.sequelize.transaction(async () => {
      await this.bundleService.createBundle(bundleFiles, bundleData);
    });
  }
}
