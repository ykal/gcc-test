import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SponsorsPageComponent } from './sponsors-page/sponsors-page.component';

const routes: Routes = [
  { path: '', pathMatch: 'full', component: SponsorsPageComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SponsorsRoutingModule { }
