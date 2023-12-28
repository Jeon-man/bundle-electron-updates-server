import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { createHash } from '@util/crypto';
import { hex2UUID } from '@util/uuid';
import { CreateBundleBody } from './bundle.dto';
import { BundleAsset, BundleManifest } from './models';

import fs from 'fs';
import { CreationAttributes } from 'sequelize';
import { BundlePlatform, RemoteConfig } from './bundle.types';

@Injectable()
export class BundleService {
  constructor(
    @InjectModel(BundleManifest)
    private readonly bundleManifestRepo: typeof BundleManifest,
    @InjectModel(BundleAsset)
    private readonly bundleAssetRepo: typeof BundleAsset,
  ) {}

  async createBundle(bundleFiles: Express.Multer.File[], bundleData: CreateBundleBody) {
    try {
      const { releaseName, version, remotes } = bundleData;

      const metadata = bundleData.getMetadata();

      const assets = bundleFiles.filter(file => file.fieldname === 'assets');
      const typeAssets = bundleFiles.filter(file => file.fieldname === 'types') || undefined;
      const typeIndexJson =
        bundleFiles.filter(file => file.fieldname === 'typeIndexJson')[0] || undefined;

      let typeIndexJsonAsset: BundleAsset | undefined = undefined;
      if (typeAssets && typeIndexJson)
        typeIndexJsonAsset = await this.createTypeAssets(typeAssets, typeIndexJson);

      const commonBundleManifest = {
        uuid: hex2UUID(createHash(Buffer.from(JSON.stringify(metadata)), 'sha256', 'hex')),
        releaseName,
        version,
        bundler: metadata.bundler,
        remotes: JSON.parse(remotes) as RemoteConfig,
      };

      for (const platform in metadata.bundleMetadata) {
        const existRelease = await this.bundleManifestRepo.findOne({
          where: {
            ...commonBundleManifest,
          },
        });

        if (existRelease) continue;

        const platformBundles = metadata.bundleMetadata[platform as BundlePlatform];

        const bulkCreateAssetsDto: CreationAttributes<BundleAsset>[] = [];
        const failedAssetHashs: string[] = [];
        for (const bundle of platformBundles) {
          const bundleAsset = assets.find(asset => asset.originalname === bundle.hash);

          if (!bundleAsset) {
            failedAssetHashs.push(bundle.hash);
            continue;
          }

          bulkCreateAssetsDto.push({
            uuid: bundleAsset.filename,
            hash: bundle.hash,
            path: bundle.path,
          });
        }

        if (failedAssetHashs.length > 0)
          throw new NotFoundException(
            `Bundles (${failedAssetHashs.join(',')}) not found in uploaded files.`,
          );

        const createdAssets = await this.bundleAssetRepo.bulkCreate(bulkCreateAssetsDto, {
          returning: true,
        });

        await this.bundleManifestRepo.create(
          {
            ...commonBundleManifest,
            platform: platform as BundlePlatform,
            bundleManifest_asset: createdAssets.map(asset => ({
              bundleAssetId: asset.id,
            })),
            ...(typeIndexJsonAsset ? { typeIndexJsonId: typeIndexJsonAsset.id } : {}),
          },
          {
            include: { association: BundleManifest.associations.bundleManifest_asset },
          },
        );
      }
    } catch (err) {
      throw err;
    }
  }

  async createTypeAssets(
    typeAssets: Express.Multer.File[],
    typeIndexJsonFile: Express.Multer.File,
  ) {
    const typeIndexJsonFsFile = await fs.promises.readFile(typeIndexJsonFile.path, 'utf-8');
    const typeIndexJson = JSON.parse(typeIndexJsonFsFile) as {
      publicPath: string;
      files: { hash: string; path: string }[];
    };

    const undefinedFile: string[] = [];
    const typeAssetsDto = typeAssets
      .filter(asset => {
        const findAssetToIndexJson = typeIndexJson.files.find(
          file => file.hash === asset.originalname,
        );

        if (!findAssetToIndexJson) {
          undefinedFile.push(asset.originalname);
          return false;
        }
        return true;
      })
      .map(asset => ({ hash: asset.originalname, path: asset.path, uuid: asset.filename }));

    if (undefinedFile.length > 0)
      throw new NotFoundException(
        `Not found asset file(${undefinedFile.join(', ')}) into typeIndex`,
      );

    await this.bundleAssetRepo.bulkCreate(typeAssetsDto);

    return this.bundleAssetRepo.create({
      hash: typeIndexJsonFile.originalname,
      path: '',
      uuid: typeIndexJsonFile.filename,
    });
  }

  async getAsset(uuid: string) {
    return this.bundleAssetRepo.findOne({
      where: { uuid },
      rejectOnEmpty: new NotFoundException(`Not Found Asset(${uuid})`),
    });
  }
}
