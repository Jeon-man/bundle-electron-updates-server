import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { createHash } from '@util/crypto';
import { hex2UUID } from '@util/uuid';
import { CreateBundleBody } from './bundle.dto';
import { BundleAsset, BundleManifest } from './models';

import fs from 'fs';
import { CreationAttributes } from 'sequelize';
import { BundlePlatform, ModuleFederationConfig } from './bundle.types';

@Injectable()
export class BundleService {
  constructor(
    @InjectModel(BundleManifest)
    private readonly bundleManifestRepo: typeof BundleManifest,
    @InjectModel(BundleAsset)
    private readonly bundleAssetRepo: typeof BundleAsset,
  ) {}

  async createBundle(
    {
      assets,
      types: typeAssets,
      typeIndexJson,
    }: Record<'assets', Express.Multer.File[]> &
      Partial<Record<'types', Express.Multer.File[]>> &
      Partial<Record<'typeIndexJson', Express.Multer.File>>,
    bundleData: CreateBundleBody,
  ) {
    const { releaseName, version, metadata, moduleFederationConfig } = bundleData;

    let typeIndexJsonAsset: BundleAsset | undefined = undefined;
    if (typeAssets && typeIndexJson)
      typeIndexJsonAsset = await this.createTypeAssets(typeAssets, typeIndexJson);

    const commonBundleManifest = {
      uuid: hex2UUID(createHash(Buffer.from(JSON.stringify(metadata)), 'sha256', 'hex')),
      releaseName,
      version,
      bundler: metadata.bundler,
      moduleFederationConfig: moduleFederationConfig as unknown as ModuleFederationConfig,
    };

    for (const platform in metadata.platformMetadata) {
      const existRelease = await this.bundleManifestRepo.findOne({
        where: {
          ...commonBundleManifest,
        },
      });

      if (existRelease) continue;

      const platformBundles = metadata.platformMetadata[platform as BundlePlatform];

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

      this.bundleManifestRepo.create(
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
  }

  async createTypeAssets(
    typeAssets: Express.Multer.File[],
    typeIndexJsonFile: Express.Multer.File,
  ) {
    const typeIndexJsonFsFile = await fs.promises.readFile(typeIndexJsonFile.path, 'utf-8');
    const _typeIndexJson = JSON.parse(typeIndexJsonFsFile) as {
      publicPath: string;
      files: Record<string, string>;
    };

    const files = await Promise.all(
      Object.entries(_typeIndexJson.files).map(async ([path, hash]) => {
        const typeFile = typeAssets.find(asset => asset.originalname === hash);

        if (!typeFile)
          throw new NotFoundException(`Type file "${hash}" not found in uploaded type files.`);

        return this.bundleAssetRepo.create({ hash, path, uuid: typeFile.filename });
      }),
    );

    const typeIndexJson = JSON.stringify({ ..._typeIndexJson, files });

    return this.bundleAssetRepo.create({
      hash: hex2UUID(createHash(Buffer.from(typeIndexJson), 'sha256', 'hex')),
      path: '',
      uuid: typeIndexJsonFile.filename,
    });
  }
}
