/**
 * HARNESS: demo routes for the chat UI, threads, inspector and auth pages of
 * https://docs.copilotkit.ai/angular/openai-agents-python (one per assignment.json page id).
 * Each mounts the page's verbatim component(s); see the feature files for what is HARNESS.
 */
import { Component } from '@angular/core';

import { DemoFrame } from '../components/demo-frame';
import { MediaChatComponent } from '../features/attachments/media-chat.component';
import { AuthChatComponent } from '../features/auth/auth-chat.component';
import { CssDemoComponent } from '../features/chat-ui/css-demo.component';
import { CustomMessageChatComponent } from '../features/chat-ui/custom-message-chat.component';
import { PrebuiltDemoComponent } from '../features/chat-ui/prebuilt-demo.component';
import { HeadlessThreadsDemoComponent } from '../features/headless-threads/headless-threads-demo.component';
import { InspectorChatComponent } from '../features/inspector/inspector-chat.component';
import { VoiceChatComponent } from '../features/media/voice-chat.component';
import { ThreadsDrawerDemoComponent } from '../features/threads/threads-drawer-demo.component';

@Component({
  selector: 'app-prebuilt-components-demo',
  imports: [DemoFrame, PrebuiltDemoComponent],
  template: `<app-demo-frame backTo="/prebuilt-components" heading="Prebuilt Components"><app-prebuilt-demo /></app-demo-frame>`,
})
export class PrebuiltComponentsDemo {}

@Component({
  selector: 'app-multimodal-attachments-demo',
  imports: [DemoFrame, MediaChatComponent],
  template: `<app-demo-frame backTo="/multimodal-attachments" heading="Multimodal Attachments"><div style="height: 100%"><app-media-chat /></div></app-demo-frame>`,
})
export class MultimodalAttachmentsDemo {}

@Component({
  selector: 'app-voice-page-demo',
  imports: [DemoFrame, VoiceChatComponent],
  template: `<app-demo-frame backTo="/voice" heading="Voice"><app-voice-chat /></app-demo-frame>`,
})
export class VoicePageDemo {}

@Component({
  selector: 'app-clf-css-demo',
  imports: [DemoFrame, CssDemoComponent],
  template: `<app-demo-frame backTo="/clf-css" heading="CSS Customization"><app-css-demo /></app-demo-frame>`,
})
export class ClfCssDemo {}

@Component({
  selector: 'app-clf-slots-demo',
  imports: [DemoFrame, CustomMessageChatComponent],
  template: `<app-demo-frame backTo="/clf-slots" heading="Slots"><div style="height: 100%"><app-custom-message-chat /></div></app-demo-frame>`,
})
export class ClfSlotsDemo {}

// HARNESS: the Headless UI page's verbatim code fails `ng serve` compile with today's packages
// (FINDINGS.md Headless UI entry) and took the whole app down; it is isolated in
// frontend-headless/ (ng serve :4291) so the other pages can film. This route only forwards there.
@Component({
  selector: 'app-clf-headless-ui-demo',
  template: ``,
})
export class ClfHeadlessUiDemo {
  constructor() {
    if (typeof window !== 'undefined') window.location.replace('http://localhost:4291/clf-headless-ui/demo');
  }
}

@Component({
  selector: 'app-threads-drawer-page-demo',
  imports: [DemoFrame, ThreadsDrawerDemoComponent],
  template: `<app-demo-frame backTo="/threads-drawer" heading="Threads Drawer"><app-threads-drawer-demo /></app-demo-frame>`,
})
export class ThreadsDrawerDemo {}

@Component({
  selector: 'app-headless-threads-page-demo',
  imports: [DemoFrame, HeadlessThreadsDemoComponent],
  template: `<app-demo-frame backTo="/headless-threads" heading="Headless Threads"><app-headless-threads-demo /></app-demo-frame>`,
})
export class HeadlessThreadsDemo {}

@Component({
  selector: 'app-inspector-page-demo',
  imports: [DemoFrame, InspectorChatComponent],
  template: `<app-demo-frame backTo="/inspector" heading="Inspector"><div style="height: 100%"><app-inspector-chat /></div></app-demo-frame>`,
})
export class InspectorPageDemo {}

@Component({
  selector: 'app-auth-page-demo',
  imports: [DemoFrame, AuthChatComponent],
  template: `<app-demo-frame backTo="/auth" heading="Authentication"><app-auth-chat /></app-demo-frame>`,
})
export class AuthPageDemo {}
