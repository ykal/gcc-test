import { Routes } from '@angular/router';
import { ProjectContainerComponent } from './projectContainer.component';
import { ProjectViewComponent } from './projectView/projectView.component';

export const ProjectRoutes: Routes = [
  {
    path: '',
    children: [
      {path: '', pathMatch: 'full', component: ProjectContainerComponent},
      {path: ':id', component: ProjectViewComponent}
    ]
  }
];
