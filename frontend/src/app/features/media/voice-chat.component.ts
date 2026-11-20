// voice : accept voice input start
/**
 * Voice page (docs.copilotkit.ai/angular/openai-agents-python/voice), verbatim:
 * "No component option is required to display the microphone", so the chat is a
 * plain `CopilotChat`; the mic shows only once the runtime has a transcription
 * service. The page's "Voice backend setup" link opens the generic /voice page, whose Backend
 * section (Next.js route + transcription service) is ported in frontend/server.ts under /voice.
 * The page's one TypeScript block, `registerRenderToolCall` for `getWeather`, is
 * called from the component's injection context as the page says.
 */
import { Component, inject } from '@angular/core';
import { CopilotChat, CopilotKit, registerRenderToolCall } from '@copilotkit/angular'; // HARNESS: the snippet has no imports
import { z } from 'zod'; // HARNESS: the snippet has no imports

import { WeatherCardComponent } from '../gen-ui-tool-rendering/weather-card.component'; // HARNESS: "the renderer from Render a tool result"

@Component({
  selector: 'app-voice-chat',
  imports: [CopilotChat],
  template: `
    <div style="height: 100%">
      <copilot-chat />
    </div>
  `,
})
export class VoiceChatComponent {
  constructor() {
    // HARNESS: the generic /voice page's runtimeUrl="/api/copilotkit-voice", on the runtime server (8290, /voice mount)
    inject(CopilotKit).updateRuntime({ runtimeUrl: 'http://localhost:8290/voice/api/copilotkit-voice' });
    // voice : register a renderer start
    registerRenderToolCall({
      name: "getWeather",
      args: z.object({ city: z.string() }),
      component: WeatherCardComponent,
    });
    // voice : register a renderer end
  }
}
// voice : accept voice input end
