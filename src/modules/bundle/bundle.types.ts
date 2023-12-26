export type Bundler = 'webpack' | 'repack' | 'vite';
export enum BundlePlatform {
  Ios = 'ios',
  Android = 'android',
  Web = 'web',
}
export const BundlePlatformList = Object.values(BundlePlatform);

export interface RemoteConfig {
  type: 'local' | 'server';
  url: string;
  name: string;
  configName: string;
  typeIndexJsonUrl: string;
}

export interface IBundleAsset {
  hash: string;
  path: string;
}

export interface BundleMetadata {
  version: 0;
  bundler: Bundler;
  bundleMetadata: Record<BundlePlatform, IBundleAsset[]>;
}

export const hexUuidRegexRaw = '[0-9a-f]{32}';
export const bundleNameRegex = RegExp(
  `^(${BundlePlatformList.join('|')})-(${hexUuidRegexRaw}).js$`,
);
