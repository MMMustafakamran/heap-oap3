/**
 * CLI recordings: none for OpenAI Agents.
 *
 * `npx copilotkit@latest init --framework oap` fails on CLI 4.33.1 with
 * `Unsupported framework "oap"` (FINDINGS.md #2), so there's no scaffold flow to film.
 * The exports stay because cli-capture.ts, cli-render.ts and core/doctor.ts import them.
 */
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { type DistributionConfig } from '../core/cli/distribute';
import { defineCliFlows, defineCliVideos } from '../core/cli/flow';

export const CLI_DISTRIBUTION: DistributionConfig = {
  source: join(tmpdir(), 'oap-cli-unused'),
  targets: [],
  exclude: ['node_modules', '.next', '.git', '.turbo'],
  envFiles: [],
};

export const CLI_FLOWS = defineCliFlows([]);

export const REMEDIATED_FLOWS = new Set<string>([]);

export const PROVES_BROKEN = new Set<string>([]);

export const CLI_VIDEOS = defineCliVideos([]);
