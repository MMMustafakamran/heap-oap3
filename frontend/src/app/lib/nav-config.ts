/**
 * The nav, every route header, the demo links, and the README status table all
 * read from here, so a doc page and its implementation status are described
 * exactly once.
 *
 * Groups mirror the sidebar at
 * https://docs.copilotkit.ai/angular/ag2 as of DOC_SYNC_DATE. The
 * last doc page covers four topics at once; it is split into four routes here,
 * which all point back at the same `docPath`.
 */

export const DOC_SYNC_DATE = '2026-08-31';
export const DOCS_ROOT = 'https://docs.copilotkit.ai/angular/ag2';

/**
 * working   — implemented and exercisable against the local stack.
 * partial   — implemented, but something outside this repo limits it
 *             (a premium license, a runtime capability this repo does not run).
 * reference — intentionally not a live feature; notes surface only.
 * broken    — implemented but currently failing.
 */
export type RouteStatus =
  | 'working'
  | 'partial'
  | 'reference'
  | 'broken'
  | 'not-started';

export interface RouteMeta {
  /** App route path. */
  path: string;
  /** Nav label. */
  title: string;
  /** Doc page this route tests, relative to docs.copilotkit.ai. */
  docPath: string;
  /** One-line description in our own words. */
  summary: string;
  status: RouteStatus;
  /** Shown in the route header when the status is not plain "working". */
  statusNote?: string;
  /** Feature requires a CopilotKit Enterprise Intelligence license. */
  premium?: boolean;
  /**
   * This route owns a live interactive surface, which lives at `<path>/demo`
   * rather than on the page itself. The doc route keeps the explanation and the
   * source; the demo route is chrome-free so it can be screen-recorded alone.
   */
  hasDemo?: boolean;
}

/** Where a route's interactive demo lives, if it has one. */
export function demoPath(route: RouteMeta): string | undefined {
  if (!route.hasDemo) return undefined;
  return route.path === '/' ? '/demo' : `${route.path}/demo`;
}

export interface NavGroup {
  title: string;
  routes: RouteMeta[];
}

export const NAV: NavGroup[] = [
  {
    title: 'Getting Started',
    routes: [
      {
        path: '/',
        title: 'Introduction',
        docPath: '/angular/ag2',
        summary:
          'What this harness covers and how the three processes fit together.',
        status: 'reference',
        statusNote: 'Landing page — orientation and a live connection check.',
      },
      {
        path: '/quickstart',
        hasDemo: true,
        title: 'Quickstart',
        docPath: '/angular/ag2/quickstart',
        summary:
          'The smallest end-to-end path: an HttpAgent in Copilot Runtime pointed at the AG2 AGUIStream endpoint, provideCopilotKit, and one copilot-chat.',
        status: 'working',
        statusNote:
          'The Angular half of the page is complete. Its backend step is not: the page ships the literal comment "setup skipped: agent-setup is not bundled for ag2" where the AG2 server should be. See Known issues.',
      },
    ],
  },
  {
    title: 'Guides',
    routes: [
      // HARNESS: OpenAI Agents Shared State / HITL / interrupts / WebMCP / Sub-agents pages (2026-11-18).
      { path: '/shared-state', hasDemo: true, title: 'Shared State', docPath: '/angular/openai-agents-python/shared-state', summary: 'injectAgentStore read + agent.setState write.', status: 'working' },
      { path: '/agent-readonly', hasDemo: true, title: 'Agent Read-Only Context', docPath: '/angular/openai-agents-python/shared-state/agent-readonly', summary: 'connectAgentContext and CopilotKitAgentContext.', status: 'working' },
      { path: '/human-in-the-loop', hasDemo: true, title: 'HITL Overview', docPath: '/angular/openai-agents-python/human-in-the-loop', summary: 'registerHumanInTheLoop decision tool.', status: 'working' },
      { path: '/use-interrupt', hasDemo: true, title: 'Pausing the Agent for Input', docPath: '/angular/openai-agents-python/human-in-the-loop/useInterrupt', summary: 'injectInterrupt typed controller.', status: 'working' },
      { path: '/headless-interrupts', hasDemo: true, title: 'Headless Interrupts', docPath: '/angular/openai-agents-python/human-in-the-loop/headless', summary: 'store().interruptController.', status: 'working' },
      { path: '/webmcp', hasDemo: true, title: 'WebMCP', docPath: '/angular/openai-agents-python/webmcp', summary: 'registerFrontendTool with webmcp.', status: 'working' },
      { path: '/multi-agent-subagents', hasDemo: true, title: 'Sub-Agents', docPath: '/angular/openai-agents-python/multi-agent/subagents', summary: 'Supervisor with sub-agent tools and a delegation log.', status: 'working' },
    ],
  },
  // HARNESS: OpenAI Agents Angular chat UI / threads / inspector / auth pages (2026-11-18).
  {
    title: 'Chat UI, threads, inspector, auth',
    routes: [
      { path: '/prebuilt-components', hasDemo: true, title: 'Prebuilt Components', docPath: '/angular/openai-agents-python/prebuilt-components', summary: 'Prebuilt Components page, verbatim.', status: 'not-started' },
      { path: '/multimodal-attachments', hasDemo: true, title: 'Multimodal Attachments', docPath: '/angular/openai-agents-python/multimodal-attachments', summary: 'Multimodal Attachments page, verbatim.', status: 'not-started' },
      { path: '/voice', hasDemo: true, title: 'Voice', docPath: '/angular/openai-agents-python/voice', summary: 'Voice page, verbatim.', status: 'not-started' },
      { path: '/clf-css', hasDemo: true, title: 'CSS Customization', docPath: '/angular/openai-agents-python/custom-look-and-feel/css', summary: 'CSS Customization page, verbatim.', status: 'not-started' },
      { path: '/clf-slots', hasDemo: true, title: 'Slots', docPath: '/angular/openai-agents-python/custom-look-and-feel/slots', summary: 'Slots page, verbatim.', status: 'not-started' },
      { path: '/clf-headless-ui', hasDemo: true, title: 'Headless UI', docPath: '/angular/openai-agents-python/custom-look-and-feel/headless-ui', summary: 'Headless UI page, verbatim.', status: 'not-started' },
      { path: '/threads-drawer', hasDemo: true, title: 'Threads Drawer', docPath: '/angular/openai-agents-python/prebuilt-components/copilot-threads-drawer', summary: 'Threads Drawer page, verbatim.', status: 'not-started' },
      { path: '/headless-threads', hasDemo: true, title: 'Headless Threads', docPath: '/angular/openai-agents-python/headless-threads', summary: 'Headless Threads page, verbatim.', status: 'not-started' },
      { path: '/inspector', hasDemo: true, title: 'Inspector', docPath: '/angular/openai-agents-python/inspector', summary: 'Inspector page, verbatim.', status: 'not-started' },
      { path: '/auth', hasDemo: true, title: 'Authentication', docPath: '/angular/openai-agents-python/auth', summary: 'Authentication page, verbatim.', status: 'not-started' },
    ],
  },
];

export const ALL_ROUTES: RouteMeta[] = NAV.flatMap((g) => g.routes);

export function findRoute(path: string): RouteMeta | undefined {
  return ALL_ROUTES.find((r) => r.path === path);
}

export function docUrl(route: RouteMeta): string {
  return `https://docs.copilotkit.ai${route.docPath}`;
}

export const STATUS_LABEL: Record<RouteStatus, string> = {
  working: 'Working',
  partial: 'Partial',
  reference: 'Reference',
  broken: 'Broken',
  'not-started': 'Not started',
};
