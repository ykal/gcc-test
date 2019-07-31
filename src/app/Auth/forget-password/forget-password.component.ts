import { Component, OnInit } from "@angular/core";
import { AuthService } from "../services/auth.service";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";

@Component({
  selector: "app-forget-password",
  templateUrl: "./forget-password.component.html",
  styleUrls: ["./forget-password.component.css"]
})
export class ForgetPasswordComponent implements OnInit {
  public forgetPasswordForm: FormGroup;
  public email = "";
  public isLoading = false;
  public requestSucess = false;
  public error = false;

  constructor(public authService: AuthService, public fb: FormBuilder) {}

  ngOnInit() {
    this.forgetPasswordForm = this.fb.group({
      email: ["", Validators.required]
    });
  }

  requestForgotPassword() {
    if (this.forgetPasswordForm.valid) {
      //  request password change
      this.isLoading = true;
      this.authService.requestPasswordChange(this.email.toLowerCase()).subscribe(
        res => {
          if (res.result && res.result.sucess) {
            //  new password form
            this.isLoading = false;
            this.requestSucess = true;
          } else {
            this.error = true;
          }
        },
        error => {
          console.log("error ", error);
          this.isLoading = false;
          this.error = true;
        }
      );
    } else {
      this.markFormGroupTouched(
        this.markFormGroupTouched(this.forgetPasswordForm)
      );
    }
  }

  /**
   * Marks all controls in a form group as touched
   * @param formGroup - The form group to touch
   */
  public markFormGroupTouched(formGroup: any) {
    (<any>Object).values(formGroup.controls).forEach(control => {
      control.markAsTouched();

      if (control.controls) {
        this.markFormGroupTouched(control);
      }
    });
  }
}
