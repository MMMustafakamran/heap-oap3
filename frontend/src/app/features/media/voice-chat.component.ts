// voice : accept voice input start
/**
 * Voice page (docs.copilotkit.ai/angular/openai-agents-python/voice), verbatim:
 * "No component option is required to display the microphone", so the chat is a
 * plain `CopilotChat`; the mic shows only once the runtime has a transcription
 * service, which the page never shows (FINDINGS.md #2).
 * The page's one TypeScript block, `registerRenderToolCall` for `getWeather`, is
 * called from the component's injection context as the page says.
 */
import { Component } from '@angular/core';
import { CopilotChat, registerRenderToolCall } from '@copilotkit/angular'; // HARNESS: the snippet has no imports
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
