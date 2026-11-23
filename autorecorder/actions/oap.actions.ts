/**
 * Page actions for OpenAI Agents + Angular. Each drives the feature its doc page teaches and checks the
 * effect the page promises; a missing effect calls ctx.fail, so a broken page records as a
 * failing clip (with the failure terminal at the end) instead of a quiet pass.
 *
 * ❌/⚠️ pages (assignment.json) end with the level-1 tail: back to the doc, drag-select each
 * faulty snippet (FINDING_EVIDENCE), then the note typed into Notepad (humanizeNote, via
 * showFinding). ✅ pages are plain working takes (AUTORECORDER.md sections 2-3).
 */
import { execFile } from 'node:child_process';
import { appendFileSync, mkdirSync } from 'node:fs';
import { join } from 'node:path';
import { type Page } from 'playwright';

import { type ActionContext, type PageActionHandler } from '../core/types';
import { runStandardAction, sendPrompt, waitForAgentResponseCompletion } from '../core/actions';
import { sleep } from '../core/overlays/cursor';
import { mark } from '../core/timeline';
import { registerDocEvidence } from '../core/doc-evidence';
import { attachImage } from './attach-image';
import { type DocEvidence, showFinding } from './doc-evidence';
import { glideClick, glideTo } from './glide-click';

// ---------------------------------------------------------------------------------------------
// Findings shown at the end of ❌/⚠️ clips. `text` is matched on the rendered doc page.
// ---------------------------------------------------------------------------------------------

export const FINDING_EVIDENCE: Record<string, DocEvidence[]> = {
  quickstart: [
    { text: 'for name, agent in AGENTS.items():', caption: 'AGENTS and lifespan are never defined, no Agent is shown; _common.py has no imports (FINDINGS.md #1)' },
    { text: 'Expose the selected backend through Copilot Runtime', caption: 'The runtime step is only this (collapsed) callout; the linked guide shows a Next.js route, no Angular server' },
  ],
  'gen-ui-tool-rendering': [
    { text: 'fetch(`/api/weather?city=${encodeURIComponent(city)}`', caption: 'The handler fetches /api/weather; the page never shows or links that endpoint' },
    { text: 'then the city and the tool result', caption: 'Promised result; the card shows the app index.html instead of weather' },
  ],
  a2ui: [
    { text: 'catalog: productCatalog,', caption: 'productCatalog is never defined anywhere on the page' },
    { text: 'A catalog is required: without one, A2UI stays off even when the runtime', caption: 'So following the page, A2UI stays off' },
  ],
  'open-generative-ui': [
    { text: 'Generated code runs in a sandboxed iframe without same-origin access.', caption: 'Only the frontend provider is shown; no sandboxed UI ever renders' },
  ],
  'mcp-apps': [
    { text: 'MCP resource and tool requests travel through the selected AG-UI agent.', caption: 'No MCP server, no runtime mcpApps config, no agent change shown' },
  ],
  // --- shared-state / agent-readonly / hitl / interrupts / sub-agents (2026-11-18) ---
  'shared-state': [
    { text: 'then ask the agent for the current priority', caption: 'Page promises the agent answers "high" after agent.setState; the OpenAI Agents agent never sees the state' },
  ],
  'use-interrupt': [
    { text: 'When the backend agent pauses for input', caption: 'No page shows an OpenAI Agents backend that pauses / emits an interrupt' },
    { text: 'injectInterrupt<ReviewRequest>("default")', caption: 'The default (quickstart) agent never interrupts; payload shape (title, choices) never shown' },
  ],
  'headless-interrupts': [
    { text: 'When the backend agent emits an AG-UI interrupt', caption: 'No backend that emits an interrupt is shown' },
    { text: 'injectAgentStore("ticketing")', caption: 'No "ticketing" agent is registered anywhere on the page' },
  ],
  'clf-headless-ui': [
    { text: 'await this.copilotKit.core.runAgent({ agent });', caption: 'Fails ng serve: TS2739 AbstractAgent (@copilotkit/angular pins @ag-ui/client 1.0.2, @copilotkit/core uses 1.0.5)' },
  ],
  'multi-agent-subagents': [
    { text: 'readDelegations(this.agentStore().state())', caption: 'Frontend snippet is a class fragment: readDelegations, subAgentRendererConfig, SubAgentName never defined' },
    { text: 'The Angular Showcase uses this source:', caption: 'The only full frontend (Code tab) is React/Next.js' },
  ],
};
// Doc step highlights these before the IDE (no KNOWN_ISSUE set in this repo, so no skip list).
registerDocEvidence(FINDING_EVIDENCE);

export const FINDING_NOTES: Record<string, string> = {
  quickstart: [
    "page says connect the openai agents backend then run backend runtime and angular app and chat works",
    "following just the page theres nothing to run, chat only answers on a backend and runtime i put together myself",
    "_common.py has no imports,SLUG and get_forwarded_headers undefined, agent_server.py loops over AGENTS and uses lifespan which are never defined",
    "no Agent is ever shown,and the linked runtime page only has a next.js route so no server for angular",
  ].join('\n'),
  'gen-ui-tool-rendering': [
    "page says ask for weather in paris and the card shows loading then the city and the tool result",
    "card does render but the result line is a whole html page,the angular index.html",
    "handler fetches /api/weather?city= but the page never gives that endpoint or says where it comes from",
    "so the tool never returns weather, u have to write your own weather api to make it work",
  ].join('\n'),
  a2ui: [
    "page says pass your catalog thru provideCopilotKit a2ui and the chat renders your catalog components",
    "asked for a flight card and only got a plain text reply,no a2ui surface at all",
    "the config uses productCatalog which is never defined,catalog snippets also use dynamicString AcmeBadge PanelComponent with no imports",
    "page itself says without a catalog a2ui stays off,so as written theres nothing to render with",
  ].join('\n'),
  'open-generative-ui': [
    "page says add openGenerativeUI with sandboxFunctions and the agent streams sandboxed html into the chat",
    "asked for 3 filter buttons,no sandbox iframe ever shows,agent just writes html buttons into the message and they dont do anything",
    "asked straight out and the agent says it has no generatesandboxedui tool",
    "page only shows the angular provider,nothing about turning open generative ui on in the runtime",
  ].join('\n'),
  'mcp-apps': [
    "page says add provideMCPApps and the chat renders the app resources an mcp server returns",
    "added it exactly,asked for an app and the agent just says no mcp app tool is available",
    "page never says which mcp server to use or where to connect it,runtime config isnt shown either",
    "only the browser provider is on the page so nothing can ever return an app",
  ].join('\n'),
  // --- shared-state / agent-readonly / hitl / interrupts / sub-agents (2026-11-18) ---
  'shared-state': [
    'page says click mark high priority then ask the agent and it answers high',
    'panel shows priority high but the agent cant tell which priority it is',
    'agent.setState never reaches the agent,nothing on the backend reads the state',
    'page shows only the angular side,no backend step at all',
  ].join('\n'),
  'use-interrupt': [
    'page says when the backend agent pauses injectInterrupt gives u the pending decision',
    'asked to ship the release,the agent just answers,no review panel ever shows',
    'injectInterrupt default watches the quickstart agent which never pauses',
    'page never shows an openai agents backend that interrupts or what payload gives title and choices',
  ].join('\n'),
  'headless-interrupts': [
    'page says store interruptController holds the pending decision when the backend interrupts',
    'asked to ship the ticket,the agent just replies,no approval ever shows',
    'injectAgentStore ticketing but no ticketing agent exists anywhere and no backend that interrupts',
  ].join('\n'),
  'clf-headless-ui': [
    'page says build ur own chat with injectAgentStore and run it thru copilotKit.core.runAgent',
    'with the code exactly as given ng serve never compiles,so the app doesnt even open',
    'error ts2739 type abstractagent is missing _threadId,maxEnforcedEntries on the runAgent line',
    'copilotkit angular pins ag-ui client 1.0.2 but copilotkit core it pulls in now uses 1.0.5,two different agent types',
    'thats what u get today from the install line on the quickstart,page doesnt say any version',
  ].join('\n'),
  'multi-agent-subagents': [
    'page says the ui renders a live delegation log while the supervisor delegates',
    'the agent code is there but the angular part is a fragment,readDelegations subAgentRendererConfig SubAgentName never defined',
    'code tab only has react next.js files,no angular log',
    'had to write the delegation log myself and add demo_agents _common,then the sub agents show up',
  ].join('\n'),
};

async function writeFinding(page: Page, id: string, config: Parameters<PageActionHandler>[1]): Promise<void> {
  await showFinding(page, config, FINDING_EVIDENCE[id], FINDING_NOTES[id]);
}

async function settle(page: Page, msgCount: number, ctx: ActionContext, quietMs = 3000): Promise<void> {
  try {
    // Page `timeouts` (pages.config.ts) apply here too, not only in runStandardAction.
    await waitForAgentResponseCompletion(page, quietMs, msgCount, undefined, { startTimeoutMs: ctx.timeouts.replyStartMs, streamTimeoutMs: ctx.timeouts.replyStreamMs });
  } catch (e) {
    ctx.warn(`Reply did not complete cleanly: ${String(e).slice(0, 160)}`);
  }
}

/**
 * Run a real command and append its output to a repo log (logs/<file>), so the failure terminal
 * at the end of the clip tails the real error. Never throws.
 */
function runToLog(root: string, file: string, cwd: string, cmd: string, args: string[]): Promise<void> {
  mkdirSync(join(root, 'logs'), { recursive: true });
  const log = join(root, 'logs', file);
  appendFileSync(log, `\n$ (cd ${cwd} && ${cmd} ${args.join(' ')})\n`);
  return new Promise((resolve) => {
    execFile(cmd, args, { cwd: join(root, cwd), timeout: 180000, shell: process.platform === 'win32' }, (_err, stdout, stderr) => {
      appendFileSync(log, `${stdout ?? ''}${stderr ?? ''}`);
      resolve();
    });
  });
}

const typecheck = (root: string, folder: string) =>
  runToLog(root, 'doc-typecheck.log', 'frontend', 'node', [
    'node_modules/typescript/bin/tsc',
    '-p',
    `doc-verbatim/${folder}/tsconfig.json`,
  ]);

// ---------------------------------------------------------------------------------------------
// ❌ / ⚠️ pages
// ---------------------------------------------------------------------------------------------

/** Quickstart: the chat answers, but only on the harness backend + runtime (FINDINGS.md #1). */
export const runQuickstartAction: PageActionHandler = async (page, config, root, ctx) => {
  try {
    await runStandardAction(page, config, root, ctx);
  } finally {
    await writeFinding(page, config.id, config);
  }
};

/** Voice and multimodal: attachments work; there is no mic (no transcription route shown). */
export const runVoiceAction: PageActionHandler = async (page, config, root, ctx) => {
  try {
    await attachImage(page, root);
    const msgCount = await sendPrompt(page, config.prompt, { timeoutMs: 15000 });
    await settle(page, msgCount, ctx);
    const reply = (await page.locator('copilot-chat-assistant-message').last().innerText().catch(() => '')) || '';
    if (!/quarterly|revenue|q4/i.test(reply)) ctx.fail(`The agent did not read the attached chart: "${reply.slice(0, 160)}"`);
    const mic = page.locator('button[aria-label*="microphone" i], button[aria-label*="voice" i], button[aria-label*="record" i]');
    if ((await mic.count()) === 0) mark('error', 'no mic button in the composer');
    await glideTo(page, page.locator('copilot-chat-input, textarea').first(), 2500);
  } finally {
    await writeFinding(page, config.id, config);
  }
};

/** Shared state: the UI writes priority with agent.setState, then asks the agent what it is. */
export const runSharedStateAction: PageActionHandler = async (page, config, _root, ctx) => {
  const workspace = page.locator('app-workspace').first();
  await glideTo(page, workspace, 1500);
  await glideClick(page, page.getByRole('button', { name: 'Mark high priority' }).first());
  await sleep(2000);
  await glideTo(page, workspace, 1500);
  const msgCount = await sendPrompt(page, 'What is the priority set to right now?', { timeoutMs: 15000 });
  await settle(page, msgCount, ctx);
  const reply = (await page.locator('copilot-chat-assistant-message').last().innerText().catch(() => '')) || '';
  const sawPriority = /\bhigh\b/i.test(reply);
  if (!sawPriority) mark('error');
  await glideTo(page, page.locator('copilot-chat-assistant-message').last(), 2500);
  await writeFinding(page, config.id, config);
  if (!sawPriority) {
    ctx.fail(`The agent never saw the priority the app wrote with agent.setState: "${reply.slice(0, 160)}" (FINDINGS.md #4).`);
  }
};

/** Authentication: signed out the hooked runtime answers 401 (no reply); signed in it replies. */
export const runAuthAction: PageActionHandler = async (page, config, _root, ctx) => {
  await sendPrompt(page, config.prompt, { timeoutMs: 15000, expectInputToEmpty: false }).catch(() => {});
  await sleep(9000);
  mark('action', 'signed out: runtime answers 401, no reply');
  await glideClick(page, page.getByRole('button', { name: 'Sign in' }).first());
  await sleep(1500);
  const msgCount = await sendPrompt(page, config.prompt, { timeoutMs: 15000 });
  await settle(page, msgCount, ctx);
  const reply = (await page.locator('copilot-chat-assistant-message').last().innerText().catch(() => '')) || '';
  if (!reply.trim()) ctx.warn('No reply after signing in.');
  await glideTo(page, page.locator('copilot-chat-assistant-message').last(), 2500);
};

/** Sub-agents: ask for research -> write -> critique; the delegation log stays empty; the doc's agent won't import. */
export const runSubagentsAction: PageActionHandler = async (page, config, root, ctx) => {
  const msgCount = await sendPrompt(page, config.prompt, { timeoutMs: 15000 });
  await settle(page, msgCount, ctx);
  const log = page.getByText('No delegations yet.').first();
  const empty = await log.isVisible().catch(() => false);
  await glideTo(page, log, 2500);
  if (empty) mark('error');
  await runToLog(root, 'subagents-import.log', 'backend', 'uv', ['run', 'python', '-c', 'import src.agents.subagents']);
  await writeFinding(page, config.id, config);
  if (empty) ctx.fail("No delegation ran: the page's subagents.py can't be imported (ModuleNotFoundError: No module named 'src.agents._loop_cap', FINDINGS.md #5).");
};

// ---------------------------------------------------------------------------------------------
// ✅ pages
// ---------------------------------------------------------------------------------------------

/** HITL: the approval card appears, the user approves, the run resumes. */
export const runHitlAction: PageActionHandler = async (page, config, _root, ctx) => {
  const msgCount = await sendPrompt(page, config.prompt, { timeoutMs: 15000 });
  const card = page.locator('app-approval-card').last();
  const shown = await card.waitFor({ state: 'visible', timeout: 90000 }).then(() => true).catch(() => false);
  if (!shown) {
    ctx.fail('The approval card never appeared: requestApproval was not called.');
    return;
  }
  await glideTo(page, card, 2000);
  await glideClick(page, card.getByRole('button', { name: 'Approve' }));
  await sleep(1500);
  await settle(page, msgCount, ctx);
  await sleep(2000);
};

/** Inspector: run one turn, open the launcher, walk the panes the quickstart names. */
export const runInspectorAction: PageActionHandler = async (page, config, _root, ctx) => {
  const msgCount = await sendPrompt(page, config.prompt, { timeoutMs: 15000 });
  await settle(page, msgCount, ctx);
  const inspector = page.locator('cpk-web-inspector');
  if ((await inspector.count()) === 0) {
    ctx.fail('No <cpk-web-inspector> on the page.');
    return;
  }
  await glideClick(page, inspector.locator('button').first());
  await sleep(2500);
  for (const pane of ['Agent', 'AG-UI Events', 'Rich Threads']) {
    const link = inspector.getByText(pane, { exact: true }).first();
    if (await link.isVisible().catch(() => false)) {
      await glideClick(page, link);
      await sleep(3000);
    } else {
      ctx.warn(`Inspector pane "${pane}" not found.`);
    }
  }
};

// ---------------------------------------------------------------------------------------------
// Frontend Tools + Generative UI pages (2026-11-18)
// ---------------------------------------------------------------------------------------------

/** Text of the last assistant message, optionally inside a scope selector (shared by the pages below). */
const lastReply = async (page: Page, scope?: string) =>
  ((await page.locator(scope ? scope + ' copilot-chat-assistant-message' : 'copilot-chat-assistant-message').last().innerText().catch(() => '')) || '').trim();

/** Frontend Tools: change_background must change the gradient behind the chat. */
export const runFrontendToolsAction: PageActionHandler = async (page, config, _root, ctx) => {
  const host = page.locator('[data-testid="background-host"]').first();
  const before = await host.evaluate((el) => (el as HTMLElement).style.background).catch(() => '');
  const msgCount = await sendPrompt(page, config.prompt, { timeoutMs: 15000 });
  const changed = await page
    .waitForFunction(
      (prev) => (document.querySelector('[data-testid="background-host"]') as HTMLElement | null)?.style.background !== prev,
      before,
      { timeout: 90000 },
    )
    .then(() => true)
    .catch(() => false);
  await settle(page, msgCount, ctx);
  if (!changed) ctx.fail('change_background never ran: the background did not change.');
  await sleep(1500);
};

/** Components as Tools: show_incident must render the incident card with the id. */
export const runToolBasedAction: PageActionHandler = async (page, config, _root, ctx) => {
  const msgCount = await sendPrompt(page, config.prompt, { timeoutMs: 15000 });
  const card = page.locator('app-incident-card article').last();
  const shown = await card.waitFor({ state: 'visible', timeout: 90000 }).then(() => true).catch(() => false);
  await settle(page, msgCount, ctx);
  if (!shown) {
    ctx.fail('show_incident never rendered the incident card.');
    return;
  }
  const text = (await card.innerText().catch(() => '')) || '';
  if (!/INC-4711/i.test(text)) ctx.fail(`The incident card rendered without the id: "${text.slice(0, 80)}"`);
  await glideTo(page, card, 2500);
};

/**
 * Tool Call Rendering: the weather card must show the city and the tool result. The page's
 * handler fetches /api/weather, which the page never provides: ng serve answers with index.html.
 */
export const runToolRenderingAction: PageActionHandler = async (page, config, _root, ctx) => {
  const msgCount = await sendPrompt(page, config.prompt, { timeoutMs: 15000 });
  const card = page.locator('app-weather-card article').last();
  const shown = await card.waitFor({ state: 'visible', timeout: 90000 }).then(() => true).catch(() => false);
  await settle(page, msgCount, ctx);
  if (!shown) {
    mark('error');
    await writeFinding(page, config.id, config);
    ctx.fail('The weather card never reached "complete": getWeather did not render.');
    return;
  }
  const result = ((await card.locator('p').innerText().catch(() => '')) || '').trim();
  await glideTo(page, card, 2500);
  const broken = !result || /<!doctype html|<html/i.test(result);
  if (broken) mark('error');
  await sleep(1500);
  await writeFinding(page, config.id, config);
  if (broken) ctx.fail(`The weather card's tool result is not weather: "${result.slice(0, 100)}" (/api/weather is never provided by the page, so fetch gets the app's index.html).`);
};

/** A2UI: ask for a catalog component; A2UI stays off without the never-defined catalog. */
export const runA2uiAction: PageActionHandler = async (page, config, root, ctx) => {
  const msgCount = await sendPrompt(page, config.prompt, { timeoutMs: 15000 });
  await settle(page, msgCount, ctx);
  const surface = page.locator('copilot-a2ui-surface, copilot-a2ui-activity-renderer, copilot-a2ui-tool-renderer');
  const rendered = await surface.first().waitFor({ state: 'visible', timeout: 8000 }).then(() => true).catch(() => false);
  const reply = await lastReply(page);
  if (reply) await glideTo(page, page.locator('copilot-chat-assistant-message').last(), 2500);
  if (!rendered) mark('error');
  await sleep(1500);
  await typecheck(root, 'a2ui');
  await writeFinding(page, config.id, config);
  if (!rendered) ctx.fail(`No A2UI surface rendered, the agent answered in text: "${reply.slice(0, 120)}". The page's productCatalog is never defined, and without a catalog "A2UI stays off".`);
};

/** MCP Apps: provideMCPApps() alone; the page gives no MCP server, so no app resource can come back. */
export const runMcpAppsAction: PageActionHandler = async (page, config, _root, ctx) => {
  const msgCount = await sendPrompt(page, config.prompt, { timeoutMs: 15000 });
  await settle(page, msgCount, ctx);
  const app = page.locator('copilot-mcp-apps-activity-renderer, copilot-mcp-apps-widget');
  const rendered = await app.first().waitFor({ state: 'visible', timeout: 8000 }).then(() => true).catch(() => false);
  const reply = await lastReply(page);
  if (reply) await glideTo(page, page.locator('copilot-chat-assistant-message').last(), 2500);
  if (!rendered) mark('error');
  await sleep(1500);
  await writeFinding(page, config.id, config);
  if (!rendered) ctx.fail(`No MCP app rendered, the agent answered in text: "${reply.slice(0, 120)}". The page never says which MCP server to connect or where (no runtime mcpApps config).`);
};

/** Open Generative UI: the sandboxed iframe must render; clicking a button calls setDashboardFilter. */
export const runOpenGenUiAction: PageActionHandler = async (page, config, _root, ctx) => {
  const msgCount = await sendPrompt(page, config.prompt, { timeoutMs: 15000 });
  const sel = '[data-testid="open-generative-ui-final-sandbox"]';
  const frame = page.locator(sel).last();
  // 75 s: under the 90 s freeze limit (review 2026-11-18)
  const shown = await frame.waitFor({ state: 'visible', timeout: 75000 }).then(() => true).catch(() => false);
  await settle(page, msgCount, ctx, 5000);
  if (!shown) {
    mark('error');
    await writeFinding(page, config.id, config);
    ctx.fail(`No sandboxed UI rendered: "${(await lastReply(page)).slice(0, 120)}"`);
    return;
  }
  await glideTo(page, frame, 2000);
  const btn = page.frameLocator(sel).last().getByRole('button', { name: /open/i }).first();
  const clicked = await btn.click({ timeout: 10000 }).then(() => true).catch(() => false);
  await sleep(2000);
  const filter = await page.evaluate(() => sessionStorage.getItem('dashboard-filter')).catch(() => null);
  if (!clicked) ctx.warn('Could not click the Open button inside the sandbox.');
  else if (!filter) ctx.fail('Clicking a sandbox button never called setDashboardFilter (sessionStorage dashboard-filter is empty).');
};


export const runPrebuiltAction: PageActionHandler = async (page, config, _root, ctx) => {
  const inline = 'app-support-chat';
  const msgCount = await sendPrompt(page, config.prompt, { timeoutMs: 15000, inputSelector: `${inline} textarea` });
  await settle(page, msgCount, ctx);
  if (!(await lastReply(page, inline)).trim()) ctx.fail('The inline chat (agentId="support") never replied.');
  await sleep(1000);
  mark('click', 'popup launcher');
  const launcher = page.locator('copilot-popup button[aria-label="Open Copilot chat"]').first();
  if ((await launcher.count()) === 0) {
    ctx.fail('No popup launcher button rendered.');
    return;
  }
  await glideClick(page, launcher).catch(async () => launcher.click({ force: true }));
  await sleep(1500);
  const open = await page.locator('copilot-popup [role="dialog"]').first().isVisible().catch(() => false);
  const sidebarOpen = await page.getByText('Workspace assistant').first().isVisible().catch(() => false);
  if (!open) {
    mark('error', sidebarOpen ? 'the sidebar opened instead of the popup' : 'popup did not open');
    await sleep(2000);
    // Level-3 minor note (FINDINGS.md minor notes): ✅ page, no finding tail.
    ctx.warn(sidebarOpen ? 'Clicking the popup launcher opened the sidebar, not the popup: both launchers sit on the same bottom-right spot.' : 'Clicking the popup launcher did not open the popup.');
    return;
  }
  const before = await page.locator('copilot-popup copilot-chat-assistant-message').count();
  await sendPrompt(page, 'Say hi from the popup in one short sentence.', { timeoutMs: 15000, inputSelector: 'copilot-popup textarea' });
  await page
    .waitForFunction((n) => document.querySelectorAll('copilot-popup copilot-chat-assistant-message').length > n, before, { timeout: 60000 })
    .catch(() => {});
  await sleep(3000);
  const popupReply = (await lastReply(page, 'copilot-popup')).trim();
  if (!popupReply) ctx.fail('The popup opened but the message got no reply in the popup.');
  else await glideTo(page, page.locator('copilot-popup copilot-chat-assistant-message').last(), 2000);
};

/** Multimodal attachments: attach the chart image, ask about it, the reply reads it. */
export const runAttachmentsAction: PageActionHandler = async (page, config, root, ctx) => {
  await attachImage(page, root);
  const msgCount = await sendPrompt(page, config.prompt, { timeoutMs: 15000 });
  await settle(page, msgCount, ctx);
  const reply = await lastReply(page);
  if (!/quarterly|revenue|q4|300/i.test(reply)) ctx.fail(`The agent did not read the attached chart: "${reply.slice(0, 160)}"`);
  await glideTo(page, page.locator('copilot-chat-assistant-message').last(), 2500);
};

/**
 * Voice: with the backend from the generic /voice page (linked as "Voice backend setup"; ported in
 * frontend/server.ts), the composer shows the mic. The take's browser plays `fakeMicWav`
 * (pages.config.ts: frontend/public/voice-sample.wav, "What is the weather in Tokyo?") as its microphone
 * (Chromium fake-media flags), and the audio really goes through the runtime's /transcribe to OpenAI.
 */
export const runVoicePageAction: PageActionHandler = async (page, _config, _root, ctx) => {
  const mic = page.locator('copilot-chat-input button[aria-label="Transcribe"]').first();
  if (!(await mic.waitFor({ state: 'visible', timeout: 30000 }).then(() => true, () => false))) {
    mark('error', 'no mic button in the composer');
    ctx.fail('No mic (Transcribe) button in the composer: runtime /info does not report audioFileTranscriptionEnabled: true.');
    return;
  }
  await glideClick(page, mic);
  mark('action', 'recording the sample phrase');
  await sleep(4000); // the wav is ~2.3 s of speech
  await glideClick(page, page.locator('copilot-chat-input button[aria-label="Finish"]').first());
  const textarea = page.locator('copilot-chat-input textarea').first();
  const got = await page
    .waitForFunction(() => /tokyo/i.test((document.querySelector('copilot-chat-input textarea') as HTMLTextAreaElement | null)?.value ?? ''), undefined, { timeout: 30000 })
    .then(() => true)
    .catch(() => false);
  const text = await textarea.inputValue().catch(() => '');
  ctx.warn(`Transcript in the composer: "${text}"`);
  if (!got) {
    mark('error', 'no transcript in the composer');
    ctx.fail(`The transcript never reached the composer (textarea: "${text}").`);
    return;
  }
  await glideTo(page, textarea, 2500);
  await sleep(1500);
  const msgCount = await page.locator('copilot-chat-assistant-message').count();
  await glideClick(page, page.locator('copilot-chat-input button[aria-label="Send message"]').first());
  await settle(page, msgCount, ctx);
  await glideTo(page, page.locator('copilot-chat-assistant-message').last(), 2500);
  await sleep(2000);
};

/** CSS customization: user bubble blue (#2563eb), assistant bubble pale blue (#eff6ff). */
export const runCssAction: PageActionHandler = async (page, config, _root, ctx) => {
  const msgCount = await sendPrompt(page, config.prompt, { timeoutMs: 15000 });
  await settle(page, msgCount, ctx);
  const bg = (sel: string) =>
    page.locator(sel).last().evaluate((el) => getComputedStyle(el).backgroundColor).catch(() => '');
  const user = await bg('.support-chat .copilotKitUserMessage');
  const assistant = await bg('.support-chat .copilotKitAssistantMessage');
  ctx.warn(`Computed backgrounds: user ${user}, assistant ${assistant}`);
  if (user !== 'rgb(37, 99, 235)') ctx.fail(`The user message is not restyled: background ${user || 'element missing'}`);
  if (assistant !== 'rgb(239, 246, 255)') ctx.fail(`The assistant message is not restyled: background ${assistant || 'element missing'}`);
  await glideTo(page, page.locator('copilot-chat-assistant-message').last(), 2500);
  await sleep(3000); // hold on the styled reply so the clip doesn't stop mid-glide (end mark landed past the video, review 2026-11-18)
};

/** Slots: every assistant reply renders through the custom component ("Assistant" label). */
export const runSlotsAction: PageActionHandler = async (page, config, _root, ctx) => {
  const msgCount = await sendPrompt(page, config.prompt, { timeoutMs: 15000 });
  await page.locator('app-custom-assistant-message').first().waitFor({ state: 'visible', timeout: 60000 }).catch(() => {});
  await settle(page, msgCount, ctx);
  await sleep(2000);
  const custom = page.locator('app-custom-assistant-message');
  const text = (await custom.last().innerText().catch(() => '')).trim();
  ctx.warn(`Custom message text: ${text.slice(0, 160)}`);
  if ((await custom.count()) === 0 || !/Assistant/.test(text)) ctx.fail('The reply did not render through CustomAssistantMessageComponent.');
  else if (text.replace(/^Assistant\s*/, '').trim() === '') ctx.fail('The custom assistant message rendered with no content.');
  else await glideTo(page, custom.last(), 2500);
};

/** Headless UI: type in the hand-written textarea, click Send, the reply appears as an article. */
export const runHeadlessUiAction: PageActionHandler = async (page, config, _root, ctx) => {
  // HARNESS: the demo lives in frontend-headless/ (:4291), whose verbatim code fails ng serve
  // compile (FINDINGS.md #14); with no composer on screen the take ends with the finding.
  await sleep(4000);
  const sent = await sendPrompt(page, config.prompt, {
    timeoutMs: 15000,
    inputSelector: 'app-headless-chat textarea[aria-label="Message"]',
    submitSelector: 'app-headless-chat button:has-text("Send")',
    messageSelector: 'app-headless-chat article[data-role="assistant"]',
  }).then(() => true).catch(() => false);
  if (!sent) return finish(page, config, ctx, 'Headless UI app never loaded: ng serve on :4291 failed to compile (TS2739 AbstractAgent on core.runAgent).');
  const replied = await page
    .waitForFunction(
      () => {
        const a = document.querySelectorAll('app-headless-chat article[data-role="assistant"]');
        return a.length > 0 && (a[a.length - 1].textContent ?? '').trim().length > 0;
      },
      undefined,
      { timeout: 90000 },
    )
    .then(() => true)
    .catch(() => false);
  await page
    .waitForFunction(() => !document.querySelector('app-headless-chat')?.textContent?.includes('Agent is working'), undefined, { timeout: 60000 })
    .catch(() => {});
  await sleep(1500);
  if (!replied) return finish(page, config, ctx, 'No assistant reply appeared in the headless transcript.');
  await glideTo(page, page.locator('app-headless-chat article[data-role="assistant"]').last(), 2500);
  await finish(page, config, ctx);
};

/** Threads Drawer: the drawer lists the conversation next to the chat. */
export const runThreadsDrawerAction: PageActionHandler = async (page, config, _root, ctx) => {
  // The drawer is a Lit element (<copilotkit-threads-drawer>): its list lives in a shadow root, which
  // innerText on the Angular host never reads (the old check called a working drawer "empty").
  const drawerText = () =>
    page.evaluate(() => (document.querySelector('copilotkit-threads-drawer')?.shadowRoot?.textContent ?? '').replace(/\s+/g, ' ').trim());
  const before = await drawerText();
  const msgCount = await sendPrompt(page, config.prompt, { timeoutMs: 15000 });
  await settle(page, msgCount, ctx);
  await sleep(6000);
  const text = await drawerText();
  await glideTo(page, page.locator('copilot-threads-drawer').first(), 2500);
  ctx.warn(`Drawer text: ${text.slice(0, 300)}`);
  const reply = (await lastReply(page)).trim();
  if (!reply) ctx.fail('No assistant reply in the chat (the run did not complete).');
  if (text === before) ctx.fail('The drawer list did not change after the chat.');
  const listed = /Recent Conversations/i.test(text) && text.replace(/.*Recent Conversations/i, '').trim().length > 0;
  if (!listed) {
    mark('error', 'drawer lists no conversation');
    ctx.fail('CopilotThreadsDrawer lists no conversation after a chat on agent "support".');
  }
  await sleep(2000);
};

/** Headless Threads: the injectThreads list shows the conversation. */
export const runHeadlessThreadsAction: PageActionHandler = async (page, config, _root, ctx) => {
  const msgCount = await sendPrompt(page, config.prompt, { timeoutMs: 15000 });
  await settle(page, msgCount, ctx);
  await sleep(3000);
  const list = page.locator('app-thread-list').first();
  const text = (await list.innerText().catch(() => '')).trim();
  await glideTo(page, list, 2500);
  ctx.warn(`Thread list text: ${text.slice(0, 300).replace(/\s+/g, ' ')}`);
  const hasThread = (await list.locator('button').count()) > 1;
  if (!hasThread) mark('error', 'thread list stays empty after a conversation');
  await writeFinding(page, config.id, config);
  if (!hasThread) ctx.fail('injectThreads lists no conversation after a chat on agent "support": only the New conversation button (runtime /info: threadEndpoints.list false).');
};

/** Inspector: the framework mounts cpk-web-inspector; the page's CSS puts the launcher bottom-left. */
export const runInspectorPageAction: PageActionHandler = async (page, config, _root, ctx) => {
  const msgCount = await sendPrompt(page, config.prompt, { timeoutMs: 15000 });
  await settle(page, msgCount, ctx);
  const inspector = page.locator('cpk-web-inspector');
  if ((await inspector.count()) === 0) {
    ctx.fail('No <cpk-web-inspector> on the page.');
    return;
  }
  const box = await inspector.first().evaluate((el) => {
    const r = el.getBoundingClientRect();
    return { left: Math.round(r.left), bottom: Math.round(window.innerHeight - r.bottom), w: Math.round(r.width), h: Math.round(r.height) };
  });
  ctx.warn(`Inspector box: ${JSON.stringify(box)}`);
  if (!(box.left < 100 && box.bottom < 100)) ctx.fail(`The Inspector launcher is not in the bottom-left corner: ${JSON.stringify(box)}`);
  const button = inspector.locator('button').first();
  if ((await button.count()) > 0) {
    await glideClick(page, button).catch(() => {});
    await sleep(3000);
  }
};

/** Authentication: signed out the hooked runtime answers 401 (no reply); signed in it replies. */
export const runAuthPageAction: PageActionHandler = async (page, config, _root, ctx) => {
  await sendPrompt(page, config.prompt, { timeoutMs: 15000, expectInputToEmpty: false }).catch(() => {});
  await sleep(8000);
  const signedOutReply = (await lastReply(page)).trim();
  if (signedOutReply) ctx.fail(`Signed out, the runtime still answered: "${signedOutReply.slice(0, 120)}"`);
  mark('action', 'signed out: runtime answers 401, no reply');
  await glideClick(page, page.getByRole('button', { name: 'Sign in' }).first());
  await sleep(1500);
  const msgCount = await sendPrompt(page, config.prompt, { timeoutMs: 15000 });
  await settle(page, msgCount, ctx);
  const reply = (await lastReply(page)).trim();
  if (!reply) ctx.fail('No reply after signing in with a valid token.');
  else await glideTo(page, page.locator('copilot-chat-assistant-message').last(), 2500);
};

// ---------------------------------------------------------------------------------------------
// Shared State / Agent Read-Only Context / HITL / interrupts / WebMCP / Sub-agents (2026-11-18)
// ---------------------------------------------------------------------------------------------


/** Ends a take: finding tail for ❌/⚠️ pages (FINDING_NOTES set), then fail if the check failed. */
async function finish(page: Page, config: Parameters<PageActionHandler>[1], ctx: ActionContext, failure?: string) {
  if (failure) mark('error');
  if (FINDING_NOTES[config.id]) await writeFinding(page, config.id, config);
  if (failure) ctx.fail(failure);
}

/** Shared State: click "Mark high priority" (agent.setState), ask the agent; the page says it answers "high". */
export const runSharedStatePageAction: PageActionHandler = async (page, config, _root, ctx) => {
  await glideClick(page, page.getByRole('button', { name: 'Mark high priority' }).first());
  await sleep(1500);
  const shown = await page.getByText('Priority: high').first().isVisible().catch(() => false);
  const msgCount = await sendPrompt(page, config.prompt, { timeoutMs: 15000 });
  await settle(page, msgCount, ctx);
  const reply = await lastReply(page);
  await glideTo(page, page.locator('copilot-chat-assistant-message').last(), 2500);
  await finish(page, config, ctx,
    !shown ? 'The panel never showed "Priority: high" after the click.'
    : !/\bhigh\b/i.test(reply) ? `The agent did not answer "high" after agent.setState: "${reply.slice(0, 160)}"` : undefined);
};

/** Agent Read-Only Context: click "Use London time", ask; the agent should see Ada, Europe/London, record-42. */
export const runAgentReadonlyAction: PageActionHandler = async (page, config, _root, ctx) => {
  await glideClick(page, page.getByRole('button', { name: 'Use London time' }).first());
  await sleep(1500);
  const msgCount = await sendPrompt(page, config.prompt, { timeoutMs: 15000 });
  await settle(page, msgCount, ctx);
  const reply = await lastReply(page);
  await glideTo(page, page.locator('copilot-chat-assistant-message').last(), 2500);
  const ok = /ada/i.test(reply) && /london/i.test(reply);
  if (ok && !/record-42/i.test(reply)) ctx.warn(`Reply did not name the selected record: "${reply.slice(0, 160)}"`);
  await finish(page, config, ctx, ok ? undefined : `The agent never saw the app context (Ada, Europe/London): "${reply.slice(0, 160)}"`);
};

/** HITL Overview: approval card appears in chat, Approve, the run continues. */
export const runHitlPageAction: PageActionHandler = async (page, config, _root, ctx) => {
  const msgCount = await sendPrompt(page, config.prompt, { timeoutMs: 15000 });
  const card = page.locator('app-approval-card').last();
  const shown = await card.waitFor({ state: 'visible', timeout: 90000 }).then(() => true).catch(() => false);
  let resumed = false;
  let decisionLost = '';
  if (shown) {
    await glideTo(page, card, 2000);
    await glideClick(page, card.getByRole('button', { name: 'Approve' }));
    await settle(page, msgCount, ctx, 5000);
    resumed = (await card.getByRole('button', { name: 'Approve' }).count()) === 0 && (await lastReply(page)).length > 0;
    const r = await lastReply(page);
    if (resumed && !/approved/i.test(r)) { resumed = false; decisionLost = r.slice(0, 160); }
    await sleep(1500);
  }
  await finish(page, config, ctx,
    !shown ? 'The approval card never appeared: requestApproval was not called.'
    : decisionLost ? `After Approve the agent never got { approved: true }: "${decisionLost}"` : !resumed ? 'After Approve the run did not continue.' : undefined);
};

/** useInterrupt / Headless Interrupts: the interrupt UI appears above the chat; resolve it; the run resumes. */
export const runInterruptAction: PageActionHandler = async (page, config, _root, ctx) => {
  const msgCount = await sendPrompt(page, config.prompt, { timeoutMs: 15000 });
  let decisionLost = '';
  const host = page.locator(config.id === 'use-interrupt' ? 'app-interrupt-panel section' : 'app-ticket-approval section').first();
  // Wait for the interrupt UI or a finished plain reply, then give the UI 15 s more (a 90 s blind
  // wait after the reply froze the clip, review 2026-11-23).
  let shown = await Promise.race([
    host.waitFor({ state: 'visible', timeout: 90000 }).then(() => true).catch(() => false),
    settle(page, msgCount, ctx).then(() => false).catch(() => false),
  ]);
  if (!shown) shown = await host.waitFor({ state: 'visible', timeout: 15000 }).then(() => true).catch(() => false);
  let resumed = false;
  if (shown) {
    await glideTo(page, host, 2000);
    const choice = host.getByRole('button').filter({ hasNotText: 'Cancel' });
    const hasChoice = (await choice.count()) > 0;
    if (config.id === 'use-interrupt' && !hasChoice) ctx.warn('The panel shows no choices (only Cancel): event.value has no title/choices.');
    const btn = config.id === 'use-interrupt' ? (hasChoice ? choice.first() : host.getByRole('button', { name: 'Cancel' })) : host.getByRole('button', { name: 'Approve' });
    await glideClick(page, btn);
    const gone = await host.waitFor({ state: 'hidden', timeout: 30000 }).then(() => true).catch(() => false);
    await settle(page, msgCount, ctx, 5000);
    resumed = gone && (await lastReply(page)).length > 0;
    const r = await lastReply(page);
    if (resumed && !/\bapprov|cancel|declin|reject|ship|\bhold\b/i.test(r)) decisionLost = r.slice(0, 160);
    if (resumed) await glideTo(page, page.locator('copilot-chat-assistant-message').last(), 2500);
  }
  await finish(page, config, ctx,
    !shown ? 'No interrupt UI appeared: the agent never paused.'
    : !resumed ? 'Resolving the interrupt did not resume the run.'
    : decisionLost ? `The run resumed but the agent never saw the decision: "${decisionLost}"` : undefined);
};

/** WebMCP: the CopilotKit agent calls searchOrders; also note whether document.modelContext exists. */
export const runWebmcpAction: PageActionHandler = async (page, config, _root, ctx) => {
  const hasMc = await page.evaluate(() => 'modelContext' in document).catch(() => false);
  if (!hasMc) ctx.warn('document.modelContext is not available in this browser (WebMCP needs the Chrome flag / origin trial); the mirror is not observable in the take.');
  const msgCount = await sendPrompt(page, config.prompt, { timeoutMs: 15000 });
  await settle(page, msgCount, ctx);
  const reply = await lastReply(page);
  await glideTo(page, page.locator('copilot-chat-assistant-message').last(), 2500);
  const calls = await page.evaluate(() => (window as unknown as { __searchOrdersCalls?: string[] }).__searchOrdersCalls ?? []).catch(() => [] as string[]);
  if (calls.length) ctx.warn(`searchOrders handler ran with: ${calls.join(', ')}`);
  // The WebMCP feature is the browser-agent path; the CopilotKit agent path is the Frontend Tools page's.
  if (!calls.length) ctx.fail("searchOrders was never called.");
  else if (!/ORD-1001/i.test(reply)) ctx.warn(`searchOrders ran but its result never reached the reply: "${reply.slice(0, 160)}"`);
  await finish(page, config, ctx);
};

/** Sub-agents: the supervisor delegates; the delegation log (state.delegations) fills in. */
export const runSubagentsPageAction: PageActionHandler = async (page, config, root, ctx) => {
  const msgCount = await sendPrompt(page, config.prompt, { timeoutMs: 15000 });
  const entry = page.locator('app-subagents-chat article.delegation').first();
  const got = await entry.waitFor({ state: 'visible', timeout: 150000 }).then(() => true).catch(() => false);
  await settle(page, msgCount, ctx, 8000);
  await glideTo(page, got ? entry : page.getByText('No delegations yet.').first(), 2500);
  const n = await page.locator('app-subagents-chat article.delegation').count();
  if (got && n < 3) ctx.warn(`Only ${n} delegation(s) logged (expected research, writing, critique).`);
  await typecheck(root, 'multi-agent-subagents');
  await finish(page, config, ctx, got ? undefined : 'No delegation was logged: the supervisor never ran a sub-agent.');
};


