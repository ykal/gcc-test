import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SponsorsRoutingModule } from './sponsors-routing.module';
import { SponsorsPageComponent } from './sponsors-page/sponsors-page.component';
import { SharedModule } from '../shared/shared.module';

@NgModule({
  imports: [
    CommonModule,
    SponsorsRoutingModule,
    SharedModule
  ],
  declarations: [SponsorsPageComponent]
})
export class SponsorsModule { }
