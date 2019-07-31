/** @kal **/

import { NgModule } from '@angular/core';
import { ResourcesListComponent } from './resources-list/resources-list.component';
import {CommonModule} from '@angular/common';
import { FileUploadModule } from 'ng2-file-upload';
import {SharedModule} from '../shared/shared.module';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {ResourcesService} from './service/resources.service';
import { CreateResourceComponent } from './create-resource/create-resource.component';
import {NgCircleProgressModule} from 'ng-circle-progress';
import { ModalComponent } from './modal/modal.component';
import {NgxPaginationModule} from 'ngx-pagination';
import {SolveitTeamGuardService} from '../Auth/services/solveit-team-guard.service';
import {AuthGuardService} from '../Auth/services/auth-guard.service';
import {MomentModule} from 'angular2-moment';
import { RouterModule } from '@angular/router';
import { RESOURCES_ROUTES } from './resources.routes';


@NgModule({
  declarations: [
    ResourcesListComponent,
    CreateResourceComponent,
    ModalComponent,
  ],
  imports: [
    RouterModule.forChild(RESOURCES_ROUTES),
    CommonModule,
    SharedModule,
    FileUploadModule,
    FormsModule,
    ReactiveFormsModule,
    NgCircleProgressModule.forRoot({
      radius: 20,
      outerStrokeWidth: 8,
      innerStrokeWidth: 4,
      outerStrokeColor: '#78C000',
      innerStrokeColor: '#C7E596',
      animationDuration: 200,
      maxPercent: 100
    }),
    NgxPaginationModule,
    MomentModule
  ],
  providers: [ResourcesService, SolveitTeamGuardService, AuthGuardService],
  exports: [],
})
export class ResourcesModule { }
