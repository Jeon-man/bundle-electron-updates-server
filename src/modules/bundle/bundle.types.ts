export type Bundler = 'webpack' | 'repack' | 'vite';
export type BundlePlatform = 'ios' | 'android' | 'web';

export interface Metadata {
  version: 0;
  bundler: Bundler;
  bundleMetadata: Record<string, { path: string; hash: string }[]>;
}

export interface ModuleFederationConfig {
  url: string;
  name: string;
  port: string;
  dependencies: Record<string, string>;
  version: string;
}

export interface ManifestBundle {
  hash: string;
  url: string;
  path: string;
}

export interface Manifest {
  id: string;
  bundler: Bundler;
  platform: BundlePlatform;
  releaseName: string;
  version: string;
  createdAt: string;
  bundles: ManifestBundle[];
  moduleFederationConfig: ModuleFederationConfig;
}
