import { Routes } from '@angular/router';
import { HeadlessChatComponent } from './features/headless/headless-chat.component';

// HARNESS: the Headless UI demo route, moved here from frontend/ (see app.config.ts).
export const routes: Routes = [
  { path: 'clf-headless-ui/demo', component: HeadlessChatComponent },
  { path: '**', redirectTo: 'clf-headless-ui/demo' },
];
