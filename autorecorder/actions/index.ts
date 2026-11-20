/**
 * Which handler serves which page id. Pages not listed here use runStandardAction
 * (send the page's prompt, wait for the reply).
 */
import { type ActionContext, type PageActionHandler, type PageRecordConfig } from '../core/types';
import { runStandardAction } from '../core/actions';
import { type Page } from 'playwright';

import { waitForPageReady } from './page-ready';
import {
  runA2uiAction,
  runAuthAction,
  runFrontendToolsAction,
  runHitlAction,
  runInspectorAction,
  runQuickstartAction,
  runSharedStateAction,
  runSubagentsAction,
  runVoiceAction,
  runPrebuiltAction,
  runAttachmentsAction,
  runVoicePageAction,
  runCssAction,
  runSlotsAction,
  runHeadlessUiAction,
  runThreadsDrawerAction,
  runHeadlessThreadsAction,
  runInspectorPageAction,
  runAuthPageAction,
  runToolBasedAction,
  runToolRenderingAction,
  runMcpAppsAction,
  runOpenGenUiAction,
  runSharedStatePageAction,
  runAgentReadonlyAction,
  runHitlPageAction,
  runInterruptAction,
  runWebmcpAction,
  runSubagentsPageAction,
} from './oap.actions';

/** Keys are page ids from `config/pages.config.ts`. Doctor flags any orphans. */
export const ACTION_MAP: Record<string, PageActionHandler> = {
  quickstart: runQuickstartAction,
  'shared-state': runSharedStatePageAction,
  'agent-readonly': runAgentReadonlyAction,
  'human-in-the-loop': runHitlPageAction,
  'use-interrupt': runInterruptAction,
  'headless-interrupts': runInterruptAction,
  webmcp: runWebmcpAction,
  'multi-agent-subagents': runSubagentsPageAction,
  'prebuilt-components': runPrebuiltAction,
  'multimodal-attachments': runAttachmentsAction,
  voice: runVoicePageAction,
  'clf-css': runCssAction,
  'clf-slots': runSlotsAction,
  'clf-headless-ui': runHeadlessUiAction,
  'threads-drawer': runThreadsDrawerAction,
  'headless-threads': runHeadlessThreadsAction,
  inspector: runInspectorPageAction,
  auth: runAuthPageAction,
  'frontend-tools': runFrontendToolsAction,
  'gen-ui-tool-based': runToolBasedAction,
  'gen-ui-tool-rendering': runToolRenderingAction,
  a2ui: runA2uiAction,
  'mcp-apps': runMcpAppsAction,
  'open-generative-ui': runOpenGenUiAction,
};

export async function executePageAction(
  page: Page,
  config: PageRecordConfig,
  rootPath: string,
  ctx: ActionContext,
): Promise<void> {
  // ng serve loads lazy route chunks on demand, so markup can be on screen before it is wired.
  await waitForPageReady(page, { label: config.id });

  const handler = ACTION_MAP[config.id] ?? runStandardAction;
  await handler(page, config, rootPath, ctx);
}
