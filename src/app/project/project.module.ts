import { NgModule } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { CommonModule } from "@angular/common";

import { ProjectService } from "./project.service";
import { FileUploadModule } from "ng2-file-upload";
import { CreateProjectComponent } from "./createProject/createProject.component";
import { ProjectListComponent } from "./projectList/projectList.component";
import { ProjectViewComponent } from "./projectView/projectView.component";
import { ProjectContainerComponent } from "./projectContainer.component";
import { SharedModule } from "../shared/shared.module";
import { NgxPaginationModule } from "ngx-pagination";
import {
  NgCircleProgressModule,
  CircleProgressOptions
} from "ng-circle-progress";
import { AddProjectMemberComponent } from "./addMember/addMember.component";
import { ProjectMemberList } from "./memberList/memberList.component";
import { CreateProgressReportComponent } from "./create-progress-report/create-progress-report.component";
import { ReportViewComponent } from "./report-view/report-view.component";
import { MomentModule } from "angular2-moment";
import { JoinCompetitionComponent } from "./join-competition/join-competition.component";
import { NgMultiSelectDropDownModule } from "ng-multiselect-dropdown";
import { RouterModule } from "@angular/router";
import { ProjectRoutes } from "./project.route";
import { FacebookModule } from "ngx-facebook";

@NgModule({
  declarations: [
    CreateProjectComponent,
    ProjectListComponent,
    ProjectViewComponent,
    ProjectContainerComponent,
    AddProjectMemberComponent,
    ProjectMemberList,
    CreateProgressReportComponent,
    ReportViewComponent,
    JoinCompetitionComponent
  ],
  imports: [
    RouterModule.forChild(ProjectRoutes),
    NgxPaginationModule,
    SharedModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    FileUploadModule,
    NgCircleProgressModule,
    MomentModule,
    NgMultiSelectDropDownModule,
    FacebookModule.forRoot()
  ],
  providers: [ProjectService, CircleProgressOptions],
  exports: []
})
export class ProjectModule {}
