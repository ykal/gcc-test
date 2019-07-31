import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { OwlDateTimeModule, OwlNativeDateTimeModule } from 'ng-pick-datetime';
import { SolveitTeamService } from './solveitTeam.service';
import { EventsComponent } from './event/event.component';
import { CreateEventComponent } from './event/createEvent/createEvent.component';
import { EventListComponent } from './event/eventList/eventList.component';
import { Newsfeed } from './newsFeed/newsfeed.component';
import { SharedModule } from '../shared/shared.module';
import { EventViewComponent } from './event/eventView/viewEvent.component';
import { NgxPaginationModule } from 'ngx-pagination';
import {RouterModule} from '@angular/router';
import {AuthService} from '../Auth/services/auth.service';
import {MomentModule} from 'angular2-moment';
import { NgxSpinnerModule } from 'ngx-spinner';
import { SolveitTeamRoutes } from './solveitTeam.route';

@NgModule({
  declarations: [
    EventsComponent,
    CreateEventComponent,
    EventListComponent,
    EventViewComponent,
    Newsfeed
  ],
  imports: [
    RouterModule.forChild(SolveitTeamRoutes),
    CommonModule,
    NgxPaginationModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule,
    NgxPaginationModule,
    RouterModule,
    OwlDateTimeModule,
    OwlNativeDateTimeModule,
    MomentModule,
    NgxSpinnerModule
  ],
  providers: [SolveitTeamService, AuthService],
  exports: []
})

export class SolveitTeamModule {

}
