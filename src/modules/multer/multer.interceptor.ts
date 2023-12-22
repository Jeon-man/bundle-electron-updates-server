import { bundleNameRegex } from '@module/bundle';
import { AnyFilesInterceptor } from '@nestjs/platform-express';
import { Request } from 'express';
import fs from 'fs/promises';
import path from 'path';
import { CustomDiskStorage } from './multer.config.service';

export const DynamicAnyFileInterceptor = (subPath: string) => {
  const destinationFn = (req: Request, file: Express.Multer.File) => subPath;

  const filenameFn = async (req: Request, file: Express.Multer.File) => {
    const filename = file.originalname;
    const matchResult = filename.match(bundleNameRegex);

    if (!matchResult) return file.originalname;

    const [, , uuid] = matchResult;

    return uuid;
  };

  return AnyFilesInterceptor({
    storage: new CustomDiskStorage({
      destination: destinationFn,
      filename: filenameFn,
      fileFilter: async (req: Request, file: Express.Multer.File) => {
        const notExist = await fs
          .access(path.join(file.path), fs.constants.F_OK | fs.constants.R_OK)
          .then(() => null)
          .catch(async e => e);

        file.accepted = !!notExist;

        if (!file.accepted) throw new Error('File already exist');

        if (!req.acceptedFiles) req.acceptedFiles = [];
        req.acceptedFiles.push(file);
      },
    }),
  });
};
