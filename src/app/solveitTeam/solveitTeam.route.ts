import { Routes } from '@angular/router';
import { EventsComponent } from './event/event.component';

export const SolveitTeamRoutes: Routes = [
  {path: '', pathMatch: 'full', component: EventsComponent},
];
