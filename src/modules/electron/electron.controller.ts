import { Controller } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('electron')
@Controller('electron')
export class ElectronController {}
