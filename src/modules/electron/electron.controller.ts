import { Controller, Get, Header, Param, Query, Res } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { ManifestQueryDto } from '@util/common';
import { Response } from 'express';
import { ElectronPlatform } from './electron.types';
import { ElectronService } from './electron.service';
import { GithubService } from './github';

@ApiTags('electron')
@Controller('electron')
export class ElectronController {
  constructor(
    private readonly electronService: ElectronService,
    private readonly githubService: GithubService,
  ) {}

  @ApiOperation({
    summary: '최신 electron manifest 다운로드',
  })
  @Get('manifests/release/:releaseName/latest')
  async getLatestElectronManifest(
    @Query() query: ManifestQueryDto<ElectronPlatform>,
    @Param('releaseName') releaseName: string,
    @Res() res: Response,
  ) {
    const manifest = await this.electronService.getElectronManifest({
      runtimeVersion: query.runtimeVersion,
      platform: query.platform,
      releaseName,
    });

    const downloadUrl = await this.githubService.getReleaseAssets(
      manifest.runtimeVersion,
      manifest.platform,
    );

    res.setHeader('Location', downloadUrl);
    res.status(302).send();
  }
}
