import { invoke } from '@tauri-apps/api/core';
import type { GitRepo, GitCommit, GitLogParams, AIConfig } from './types';

// Git commands
export async function scanGitRepos(workspacePath: string): Promise<GitRepo[]> {
  return invoke('scan_git_repos', { workspacePath });
}

export async function getGitLog(params: GitLogParams): Promise<GitCommit[]> {
  return invoke('get_git_log', { params });
}

export async function getRepoAuthors(
  repoPaths: string[],
  since: string,
  until: string
): Promise<string[]> {
  return invoke('get_repo_authors', { repoPaths, since, until });
}

// AI commands
export async function generateReport(
  config: AIConfig,
  gitLog: string
): Promise<string> {
  return invoke('generate_report', { config, gitLog });
}

export async function testAIConnection(config: AIConfig): Promise<string> {
  return invoke('test_ai_connection', { config });
}
