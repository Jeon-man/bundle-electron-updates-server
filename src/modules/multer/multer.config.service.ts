import { bundleNameRegex } from '@module/bundle';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { MulterModuleOptions, MulterOptionsFactory } from '@nestjs/platform-express';
import { Request } from 'express';
import { createWriteStream } from 'fs';
import fs from 'fs/promises';
import { DiskStorageOptions, StorageEngine } from 'multer';
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
    };
  }
}

type GetFileDestination = (req: Request, file: Express.Multer.File) => string | Promise<string>;
type GetFilename = (req: Request, file: Express.Multer.File) => string | Promise<string>;
type FileFilter = (req: Request, file: Express.Multer.File) => void | Promise<void>;

export class CustomDiskStorage implements StorageEngine {
  private getDestination: GetFileDestination;
  private getFilename: GetFilename;
  private fileFilter: FileFilter;

  constructor(
    private readonly options: Omit<DiskStorageOptions, 'destination' | 'filename'> & {
      destination: GetFileDestination;
      filename: GetFilename;
      fileFilter?: FileFilter;
    },
  ) {
    this.getDestination = options.destination;
    this.getFilename = options.filename;
    this.fileFilter = options.fileFilter ?? (() => {});
  }

  async _handleFile(
    req: Request,
    file: Express.Multer.File,
    callback: (error?: any, info?: Partial<Express.Multer.File> | undefined) => void,
  ): Promise<void> {
    try {
      const destination = await this.getDestination(req, file);
      const filename = await this.getFilename(req, file);
      const filePath = path.join(destination, filename);

      const customFile = {
        destination,
        filename,
        path: filePath,
      };

      file.destination = customFile.destination;
      file.filename = customFile.filename;
      file.path = customFile.path;

      await Promise.resolve(this.fileFilter(req, file))
        .then(() => true)
        .catch(e => {
          file.rejectReason = e;
          return false;
        });

      file.stream.on('data', (chunk: any) => {
        if (!file.buffer) file.buffer = Buffer.from(chunk);
        else file.buffer = Buffer.concat([file.buffer, chunk]);
      });

      const outStream = createWriteStream(filePath);
      outStream.on('error', callback);
      outStream.on('finish', function () {
        return callback(null, {
          ...customFile,
          size: outStream.bytesWritten,
        });
      });

      file.stream.pipe(outStream);
    } catch (error) {
      return callback(error);
    }
  }

  async _removeFile(
    req: Request,
    file: Partial<Express.Multer.File>,
    callback: (error: Error | null) => void,
  ): Promise<void> {
    try {
      const path = file.path as string;

      delete file.destination;
      delete file.filename;
      delete file.path;

      await fs.unlink(path);
      return callback(null);
    } catch (error) {
      return callback(error);
    }
  }
}
