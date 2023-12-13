import { Injectable, OnApplicationBootstrap } from '@nestjs/common';
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
}
