import { CommonModule } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { SharedModule } from "../shared/shared.module";
import { NgModule } from "@angular/core";

import { MomentModule } from "angular2-moment";
import { NgxPaginationModule } from "ngx-pagination";
import { NgMultiSelectDropDownModule } from "ng-multiselect-dropdown";
import { NgxSpinnerModule } from "ngx-spinner";
import { CertificationService } from "./certification.service";
import { RequestCertificationComponent } from "./requestCertification/requestCertification.component";
import { FileUploadModule } from "ng2-file-upload";
import { NgCircleProgressModule } from "ng-circle-progress";
import { RouterModule } from "@angular/router";
import { CertificationRoutes } from "./certification.route";

@NgModule({
  declarations: [RequestCertificationComponent],
  imports: [
    SharedModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MomentModule,
    NgxPaginationModule,
    NgMultiSelectDropDownModule,
    NgxSpinnerModule,
    FileUploadModule,
    NgCircleProgressModule,
    RouterModule.forChild(CertificationRoutes)
  ],
  providers: [CertificationService],
  exports: []
})
export class CertificationModule {}
