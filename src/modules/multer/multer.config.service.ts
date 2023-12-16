import { bundleNameRegex } from '@module/bundle';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { MulterModuleOptions, MulterOptionsFactory } from '@nestjs/platform-express';
import { Request } from 'express';
import fs from 'fs/promises';
import { diskStorage } from 'multer';
import path from 'path';

@Injectable()
export class MulterConfigService implements MulterOptionsFactory {
  constructor(private readonly config: ConfigService) {}

  createMulterOptions(): MulterModuleOptions {
    const destinationFn = (req: Request, file: Express.Multer.File) =>
      this.config.get('FILE_LOCAL_STORAGE_PATH');

    const filenameFn = async (req: Request, file: Express.Multer.File) => {
      const filename = file.originalname;
      const matchResult = filename.match(bundleNameRegex);
      if (!matchResult) return filename;

      const [, , uuid] = matchResult;

      return uuid;
    };

    return {
      storage: diskStorage({
        destination: destinationFn,
        filename: filenameFn,
      }),

      fileFilter: async (req: Request, file: Express.Multer.File) => {
        // check file with same name exist
        const notExist = await fs
          .access(path.join(file.path), fs.constants.F_OK | fs.constants.R_OK)
          .then(() => null)
          .catch(async e => e);

        file.accepted = !!notExist;

        if (!file.accepted) throw new Error('File already exist');

        if (!req.acceptedFiles) req.acceptedFiles = [];
        req.acceptedFiles.push(file);
      },
    };
  }
}
