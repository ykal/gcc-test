import {Routes} from '@angular/router';
import {ResourcesListComponent} from './resources-list/resources-list.component';
import {CreateResourceComponent} from './create-resource/create-resource.component';
import {AuthGuardService} from '../Auth/services/auth-guard.service';
import {DashboardGuardService} from '../Auth/services/dashboard-guard.service';

export const RESOURCES_ROUTES: Routes = [
  {
    path: '',
    children: [
      { path: 'upload', component: CreateResourceComponent, canActivate: [AuthGuardService, DashboardGuardService] },
      { path: '', component: ResourcesListComponent, canActivate: [AuthGuardService] }
    ]
  },
];
