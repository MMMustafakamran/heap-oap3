/**
 * HARNESS: generic doc route for the pages added 2026-11-18 (route data: title, docPath, demo,
 * sources). Shows the doc link, the demo link and the verbatim source files.
 */
import { Component, inject } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';

import { SourceCode } from '../components/ui';

@Component({
  selector: 'app-doc-view',
  imports: [RouterLink, SourceCode],
  template: `
    <h1 class="mb-3 text-2xl font-bold">{{ data['title'] }}</h1>
    <div class="mb-6 flex gap-3 text-sm">
      <a [routerLink]="data['demo']" class="rounded-md bg-[var(--accent)] px-3 py-1.5 text-white">Open demo ↗</a>
      <a [href]="'https://docs.copilotkit.ai/angular/openai-agents-python/' + data['docPath']" target="_blank" rel="noreferrer" class="rounded-md border px-3 py-1.5">Doc page ↗</a>
    </div>
    <div class="space-y-6">
      @for (src of data['sources']; track src) {
        <ui-source [path]="src" />
      }
    </div>
  `,
})
export default class DocView {
  protected readonly data = inject(ActivatedRoute).snapshot.data;
}
