import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../shared/shared.module';
import { NgModule } from '@angular/core';

import { CompetitionViewComponent } from './competitionView/competitionView.component';
import { CompetitionListComponent } from './competitionList/competitionList.component';
import { CompetitionCreateComponent } from './competitionCreate/competitionCreate.component';
import { CompetitionService } from './competition.service';
import { MomentModule } from 'angular2-moment';
import { CompetitionProjectsComponent } from './competitionProjects/competitionProjects.component';
import { NgxPaginationModule } from 'ngx-pagination';
import { EditCompetitionComponent } from './edit-competition/edit-competition.component';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { NgxSpinnerModule } from 'ngx-spinner';

@NgModule({
  declarations: [
    CompetitionViewComponent,
    CompetitionListComponent,
    CompetitionCreateComponent,
    CompetitionProjectsComponent,
    EditCompetitionComponent,
  ],
  imports: [
    SharedModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MomentModule,
    NgxPaginationModule,
    NgMultiSelectDropDownModule,
    NgxSpinnerModule

  ],
  providers: [CompetitionService],
  exports: [CompetitionViewComponent]
})

export class CompetitionModule {

}
