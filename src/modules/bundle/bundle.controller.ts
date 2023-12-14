import { Controller } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('bundle')
@Controller('bundle')
export class BundleController {}
