import { Body, Controller, Post, UploadedFiles, UseInterceptors } from '@nestjs/common';
import { AnyFilesInterceptor } from '@nestjs/platform-express';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { CreateBundleBody } from './bundle.dto';
import { BundleService } from './bundle.service';

@ApiTags('bundle')
@Controller('bundle')
export class BundleController {
  constructor(private readonly bundleService: BundleService) {}

  @ApiOperation({
    summary: 'create bundle manifest with assets',
  })
  @UseInterceptors(AnyFilesInterceptor())
  @Post('upload')
  async createBundle(
    @UploadedFiles()
    bundleFiles: Record<'assets', Express.Multer.File[]> &
      Partial<Record<'types', Express.Multer.File[]>>,
    @Body() bundleData: CreateBundleBody,
  ) {}
}
