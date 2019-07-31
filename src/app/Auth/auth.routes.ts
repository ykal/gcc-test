import { Routes } from "@angular/router";
import { RegisterComponent } from "./register/register.component";
import { LoginComponent } from "./login/login.component";
import { EmailConfirmationComponent } from "./email-confirmation/email-confirmation.component";
import { NotSignedinGuardService } from "./services/not-signedin-guard.service";
import { ForgetPasswordComponent } from "./forget-password/forget-password.component";
import { NewPasswordComponent } from "./new-password/new-password.component";

export const AUTH_ROUTES: Routes = [
  {
    path: "register",
    component: RegisterComponent,
    canActivate: [NotSignedinGuardService]
  },
  {
    path: "login",
    component: LoginComponent,
    canActivate: [NotSignedinGuardService]
  },
  {
    path: "confirm/:id",
    component: EmailConfirmationComponent,
    canActivate: [NotSignedinGuardService]
  },
  { path: "forget-password", component: ForgetPasswordComponent },
  { path: "change-password/:key", component: NewPasswordComponent }
];

//http://localhost:4200/change-password/5n7aykpjjofx1kh9-5n7aykpjjofx1kh9
