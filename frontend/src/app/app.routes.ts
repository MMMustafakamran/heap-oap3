import { Routes } from '@angular/router';

import { AppChrome } from './components/app-chrome';
import { appConfig as mcpAppsConfig } from './features/mcp-apps/app.config'; // HARNESS: MCP Apps page provider, route-scoped
import { appConfig as openGenUiConfig } from './features/open-generative-ui/app.config'; // HARNESS: Open Generative UI page provider, route-scoped

/**
 * Doc routes render inside the sidebar chrome; demo routes render outside it,
 * so a demo can be screen-recorded with no page furniture. Paths here mirror
 * `src/app/lib/nav-config.ts`.
 */
export const routes: Routes = [
  // Chrome-free IDE Simulator.
  // HARNESS: demo routes for WebMCP, Authentication, Sub-agents, Native generative UI.
  // HARNESS: Shared State / HITL / interrupt / WebMCP / Sub-agents demos (2026-11-18).
  { path: 'webmcp/demo', loadComponent: () => import('./pages/demos').then((m) => m.WebmcpChatDemo) },
  { path: 'multi-agent-subagents/demo', loadComponent: () => import('./pages/demos').then((m) => m.SubagentsDemo) },
  { path: 'agent-readonly/demo', loadComponent: () => import('./pages/demos').then((m) => m.AgentReadonlyDemo) },
  { path: 'use-interrupt/demo', loadComponent: () => import('./pages/demos').then((m) => m.UseInterruptDemo) },
  { path: 'headless-interrupts/demo', loadComponent: () => import('./pages/demos').then((m) => m.HeadlessInterruptsDemo) },
  // HARNESS: chat UI / threads / inspector / auth pages (2026-11-18), pages/demos-ui.ts.
  { path: 'prebuilt-components/demo', loadComponent: () => import('./pages/demos-ui').then((m) => m.PrebuiltComponentsDemo) },
  { path: 'multimodal-attachments/demo', loadComponent: () => import('./pages/demos-ui').then((m) => m.MultimodalAttachmentsDemo) },
  { path: 'voice/demo', loadComponent: () => import('./pages/demos-ui').then((m) => m.VoicePageDemo) },
  { path: 'clf-css/demo', loadComponent: () => import('./pages/demos-ui').then((m) => m.ClfCssDemo) },
  { path: 'clf-slots/demo', loadComponent: () => import('./pages/demos-ui').then((m) => m.ClfSlotsDemo) },
  { path: 'clf-headless-ui/demo', loadComponent: () => import('./pages/demos-ui').then((m) => m.ClfHeadlessUiDemo) },
  { path: 'threads-drawer/demo', loadComponent: () => import('./pages/demos-ui').then((m) => m.ThreadsDrawerDemo) },
  { path: 'headless-threads/demo', loadComponent: () => import('./pages/demos-ui').then((m) => m.HeadlessThreadsDemo) },
  { path: 'inspector/demo', loadComponent: () => import('./pages/demos-ui').then((m) => m.InspectorPageDemo) },
  { path: 'auth/demo', loadComponent: () => import('./pages/demos-ui').then((m) => m.AuthPageDemo) },
  // HARNESS: Frontend Tools + Generative UI pages (2026-11-18), pages/demos-genui.ts. MCP Apps and
  // Open Generative UI take the page's own app.config.ts providers on their route.
  { path: 'frontend-tools/demo', loadComponent: () => import('./pages/demos-genui').then((m) => m.FrontendToolsDemo) },
  { path: 'gen-ui-tool-based/demo', loadComponent: () => import('./pages/demos-genui').then((m) => m.GenUiToolBasedDemo) },
  { path: 'gen-ui-tool-rendering/demo', loadComponent: () => import('./pages/demos-genui').then((m) => m.GenUiToolRenderingDemo) },
  { path: 'a2ui/demo', loadComponent: () => import('./pages/demos-genui').then((m) => m.A2uiPageDemo) },
  { path: 'mcp-apps/demo', providers: mcpAppsConfig.providers, loadComponent: () => import('./pages/demos-genui').then((m) => m.McpAppsDemo) },
  { path: 'open-generative-ui/demo', providers: openGenUiConfig.providers, loadComponent: () => import('./pages/demos-genui').then((m) => m.OpenGenerativeUiDemo) },
  {
    path: 'ide',
    loadComponent: () =>
      import('./pages/ide-view.component').then((m) => m.IdeViewComponent),
  },

  // Chrome-free demos.
  {
    path: 'quickstart/demo',
    loadComponent: () => import('./pages/demos').then((m) => m.QuickstartDemo),
  },
  {
    path: 'human-in-the-loop/demo',
    loadComponent: () => import('./pages/demos').then((m) => m.HitlDemo),
  },
  {
    path: 'shared-state/demo',
    loadComponent: () => import('./pages/demos').then((m) => m.SharedStateDemo),
  },

  // Doc routes, inside the sidebar chrome.
  {
    path: '',
    component: AppChrome,
    children: [
      { path: '', loadComponent: () => import('./pages/introduction') },
      { path: 'quickstart', loadComponent: () => import('./pages/quickstart') },
      { path: 'shared-state', loadComponent: () => import('./pages/doc-view'), data: { title: 'Shared State', docPath: 'shared-state', demo: '/shared-state/demo', sources: ['src/app/features/shared-state/workspace.component.ts'] } },
      { path: 'agent-readonly', loadComponent: () => import('./pages/doc-view'), data: { title: 'Agent Read-Only Context', docPath: 'shared-state/agent-readonly', demo: '/agent-readonly/demo', sources: ['src/app/features/shared-state/account-context.component.ts', 'src/app/features/shared-state/selection-context.component.ts'] } },
      { path: 'human-in-the-loop', loadComponent: () => import('./pages/doc-view'), data: { title: 'HITL Overview', docPath: 'human-in-the-loop', demo: '/human-in-the-loop/demo', sources: ['src/app/features/hitl/approval-card.component.ts', 'src/app/features/hitl/approval-tools.service.ts'] } },
      { path: 'use-interrupt', loadComponent: () => import('./pages/doc-view'), data: { title: 'Pausing the Agent for Input', docPath: 'human-in-the-loop/useInterrupt', demo: '/use-interrupt/demo', sources: ['src/app/features/hitl/interrupt-panel.component.ts'] } },
      { path: 'headless-interrupts', loadComponent: () => import('./pages/doc-view'), data: { title: 'Headless Interrupts', docPath: 'human-in-the-loop/headless', demo: '/headless-interrupts/demo', sources: ['src/app/features/hitl/ticket-approval.component.ts'] } },
      { path: 'webmcp', loadComponent: () => import('./pages/doc-view'), data: { title: 'WebMCP', docPath: 'webmcp', demo: '/webmcp/demo', sources: ['src/app/features/webmcp/order-search.component.ts'] } },
      { path: 'multi-agent-subagents', loadComponent: () => import('./pages/doc-view'), data: { title: 'Sub-Agents', docPath: 'multi-agent/subagents', demo: '/multi-agent-subagents/demo', sources: ['src/app/features/subagents/subagents-chat.component.ts'] } },
      { path: 'prebuilt-components', loadComponent: () => import('./pages/doc-view'), data: { title: 'Prebuilt Components', docPath: 'prebuilt-components', demo: '/prebuilt-components/demo', sources: ['src/app/features/chat-ui/support-chat.component.ts', 'src/app/features/chat-ui/popup-sidebar.component.ts'] } },
      { path: 'multimodal-attachments', loadComponent: () => import('./pages/doc-view'), data: { title: 'Multimodal Attachments', docPath: 'multimodal-attachments', demo: '/multimodal-attachments/demo', sources: ['src/app/features/attachments/media-chat.component.ts'] } },
      { path: 'voice', loadComponent: () => import('./pages/doc-view'), data: { title: 'Voice', docPath: 'voice', demo: '/voice/demo', sources: ['src/app/features/media/voice-chat.component.ts'] } },
      { path: 'clf-css', loadComponent: () => import('./pages/doc-view'), data: { title: 'CSS Customization', docPath: 'custom-look-and-feel/css', demo: '/clf-css/demo', sources: ['src/styles.css'] } },
      { path: 'clf-slots', loadComponent: () => import('./pages/doc-view'), data: { title: 'Slots', docPath: 'custom-look-and-feel/slots', demo: '/clf-slots/demo', sources: ['src/app/features/chat-ui/custom-assistant-message.component.ts', 'src/app/features/chat-ui/custom-message-chat.component.ts'] } },
      { path: 'clf-headless-ui', loadComponent: () => import('./pages/doc-view'), data: { title: 'Headless UI', docPath: 'custom-look-and-feel/headless-ui', demo: '/clf-headless-ui/demo', sources: ['src/app/features/headless/headless-chat.component.ts'] } },
      { path: 'threads-drawer', loadComponent: () => import('./pages/doc-view'), data: { title: 'Threads Drawer', docPath: 'prebuilt-components/copilot-threads-drawer', demo: '/threads-drawer/demo', sources: ['src/app/features/threads/conversations.component.ts'] } },
      { path: 'headless-threads', loadComponent: () => import('./pages/doc-view'), data: { title: 'Headless Threads', docPath: 'headless-threads', demo: '/headless-threads/demo', sources: ['src/app/features/threads/thread-list.component.ts', 'src/app/features/headless-threads/headless-threads-demo.component.ts'] } },
      { path: 'inspector', loadComponent: () => import('./pages/doc-view'), data: { title: 'Inspector', docPath: 'inspector', demo: '/inspector/demo', sources: ['src/styles.css', 'src/app/features/inspector/inspector-chat.component.ts'] } },
      { path: 'auth', loadComponent: () => import('./pages/doc-view'), data: { title: 'Authentication', docPath: 'auth', demo: '/auth/demo', sources: ['src/app/features/auth/auth-chat.component.ts', 'auth-runtime.ts'] } },
      { path: 'frontend-tools', loadComponent: () => import('./pages/doc-view'), data: { title: 'Frontend Tools', docPath: 'frontend-tools', demo: '/frontend-tools/demo', sources: ['src/app/features/tools/tool-feature-model.ts', 'src/app/features/tools/frontend-tools-chat.component.ts'] } },
      { path: 'gen-ui-tool-based', loadComponent: () => import('./pages/doc-view'), data: { title: 'Components as Tools', docPath: 'generative-ui/tool-based', demo: '/gen-ui-tool-based/demo', sources: ['src/app/features/gen-ui-tool-based/incident-card.component.ts', 'src/app/features/gen-ui-tool-based/tool-based-chat.component.ts'] } },
      { path: 'gen-ui-tool-rendering', loadComponent: () => import('./pages/doc-view'), data: { title: 'Tool Call Rendering', docPath: 'generative-ui/tool-rendering', demo: '/gen-ui-tool-rendering/demo', sources: ['src/app/features/gen-ui-tool-rendering/weather-card.component.ts', 'src/app/features/gen-ui-tool-rendering/tool-rendering-chat.component.ts'] } },
      { path: 'a2ui', loadComponent: () => import('./pages/doc-view'), data: { title: 'A2UI', docPath: 'generative-ui/a2ui', demo: '/a2ui/demo', sources: ['src/app/features/a2ui/a2ui-chat.component.ts'] } },
      { path: 'mcp-apps', loadComponent: () => import('./pages/doc-view'), data: { title: 'MCP Apps', docPath: 'generative-ui/mcp-apps', demo: '/mcp-apps/demo', sources: ['src/app/features/mcp-apps/app.config.ts'] } },
      { path: 'open-generative-ui', loadComponent: () => import('./pages/doc-view'), data: { title: 'Open Generative UI', docPath: 'generative-ui/open-generative-ui', demo: '/open-generative-ui/demo', sources: ['src/app/features/open-generative-ui/app.config.ts'] } },
      { path: 'status', loadComponent: () => import('./pages/status') },
      { path: '**', redirectTo: '' },
    ],
  },
];
