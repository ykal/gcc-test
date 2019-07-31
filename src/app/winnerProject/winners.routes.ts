import { Routes } from '@angular/router';
import { DashboardGuardService } from '../Auth/services/dashboard-guard.service';
import { WinnerComponent } from './winner/winner.component';
import { CompetitionWinnersPageComponent } from './competition-winners-page/competition-winners-page.component';

export const WINNERS_ROUTE: Routes = [
    { path: '', pathMatch: 'full', redirectTo: 'list' },
    { path: 'admin', component: WinnerComponent, canActivate: [DashboardGuardService] },
    { path: 'list', component: CompetitionWinnersPageComponent }
];
