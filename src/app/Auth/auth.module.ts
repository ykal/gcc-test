/** @kal **/

import { NgModule } from "@angular/core";
import { RegisterComponent } from "./register/register.component";
import { LoginComponent } from "./login/login.component";
import { RouterModule } from "@angular/router";
import { AuthService } from "./services/auth.service";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { CommonModule } from "@angular/common";
import { SharedModule } from "../shared/shared.module";
import { AdressComponent } from "./adress/adress.component";
import { QuestionariesComponent } from "./questionaries/questionaries.component";
import { EmailConfirmationComponent } from "./email-confirmation/email-confirmation.component";
import { NotSignedinGuardService } from "./services/not-signedin-guard.service";
import { AdminGuardService } from "./services/admin-guard.service";
import { DashboardGuardService } from "./services/dashboard-guard.service";
import { OwlDateTimeModule, OwlNativeDateTimeModule } from "ng-pick-datetime";
import { ForgetPasswordComponent } from "./forget-password/forget-password.component";
import { NewPasswordComponent } from "./new-password/new-password.component";
import { NgxSpinnerModule } from "ngx-spinner";
import { SolveitMgmtGuardService } from "./services/solveit-mgmt-guard.service";
import { SolveitTeamGuardService } from "./services/solveit-team-guard.service";
import { UserModuleGuardService } from "./services/userModuleGuard.service";

@NgModule({
  declarations: [
    RegisterComponent,
    LoginComponent,
    AdressComponent,
    QuestionariesComponent,
    EmailConfirmationComponent,
    ForgetPasswordComponent,
    NewPasswordComponent
  ],
  imports: [
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    CommonModule,
    SharedModule,
    OwlDateTimeModule,
    OwlNativeDateTimeModule,
    NgxSpinnerModule
  ],
  providers: [
    AuthService,
    NotSignedinGuardService,
    AdminGuardService,
    DashboardGuardService,
    SolveitTeamGuardService,
    SolveitMgmtGuardService,
    UserModuleGuardService
  ],
  exports: []
})
export class AuthModule {}
