import { BundleAsset } from './models';

export type Bundler = 'webpack' | 'repack' | 'vite';
export type BundlePlatform = 'ios' | 'android' | 'web';

export interface ModuleFederationConfig {
  url: string;
  name: string;
  port: string;
  dependencies: Record<string, string>;
  version: string;
}

export interface Metadata {
  version: 0;
  bundler: Bundler;
  bundleMetadata: Record<BundlePlatform, BundleAsset[]>;
}
