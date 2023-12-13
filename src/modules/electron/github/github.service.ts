import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  OnApplicationBootstrap,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Octokit } from 'octokit';

@Injectable()
export class GithubService implements OnApplicationBootstrap {
  private octokit: Octokit;
  constructor(private readonly config: ConfigService) {}

  onApplicationBootstrap() {
    this.octokit = new Octokit({
      auth: this.config.get<string>('GIT_TOKEN'),
    });
  }

  async getReleaseAssets(runtimeVersion: string, platform: string) {
    const {
      data: { assets },
    } = await this.octokit.request('GET /repos/{owner}/{repo}/releases/tags/{tag}', {
      owner: this.config.get('GIT_OWNER') as string,
      repo: this.config.get('GIT_REPOSITORY') as string,
      tag: `v${runtimeVersion}`,
    });

    const selectedManifestAsset = assets.find(asset => asset.name.includes(platform));
    if (!selectedManifestAsset)
      throw new NotFoundException(`Cannot Find Asset of platform ${platform}`);

    const { headers } = await this.octokit.request(
      'GET /repos/{owner}/{repo}/releases/assets/{asset_id}',
      {
        owner: this.config.get('GIT_OWNER') as string,
        repo: this.config.get('GIT_REPOSITORY') as string,
        asset_id: selectedManifestAsset.id,
        headers: {
          Accept: 'application/octet-stream',
        },
      },
    );

    if (!headers.location) throw new InternalServerErrorException('Unknown error');

    return headers.location;
  }
}
