import { BundleAsset } from './models';

export type Bundler = 'webpack' | 'repack' | 'vite';
export enum BundlePlatform {
  Ios = 'ios',
  Android = 'android',
  Web = 'web',
}
export const BundlePlatformList = Object.values(BundlePlatform);

export interface ModuleFederationConfig {
  url: string;
  name: string;
  port: string;
  dependencies: Record<string, string>;
  version: string;
}

export interface BundleMetadata {
  version: 0;
  bundler: Bundler;
  platformMetadata: Record<BundlePlatform, BundleAsset[]>;
}

export const hexUuidRegexRaw = '[0-9a-f]{32}';
export const bundleNameRegex = RegExp(
  `^(${BundlePlatformList.join('|')})-(${hexUuidRegexRaw}).js$`,
);
