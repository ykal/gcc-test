/** @kal **/

import { NgModule } from "@angular/core";
import { HeaderComponent } from "./header/header.component";
import { CommonModule } from "@angular/common";
import { ToastyModule, ToastyService } from "ng2-toasty";
import { RouterModule } from "@angular/router";
import { SharedService } from "./services/shared.service";
import { ApiService } from "./services/api.service";
import { CommonService } from "./services/common.service";
import { NotFoundComponent } from "./not-found/not-found.component";

@NgModule({
  declarations: [HeaderComponent, NotFoundComponent],
  imports: [CommonModule, RouterModule, ToastyModule.forRoot()],
  providers: [ApiService, ToastyService, SharedService, CommonService],
  exports: [HeaderComponent, ToastyModule, NotFoundComponent]
})
export class SharedModule {}
