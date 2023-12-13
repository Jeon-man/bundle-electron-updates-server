import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { ElectronManifest } from './models';

@Injectable()
export class ElectronService {
  constructor(
    @InjectModel(ElectronManifest)
    private readonly electronManifestRepo: typeof ElectronManifest,
  ) {}
}
