import { Component, Input, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { AuthService } from "../services/auth.service";
import { ActivatedRoute, Router } from "@angular/router";
import { SharedService } from "../../shared/services/shared.service";
import { PasswordValidation } from "../validator/passwordValidation";

@Component({
  selector: "app-new-password",
  templateUrl: "./new-password.component.html",
  styleUrls: ["./new-password.component.css"]
})
export class NewPasswordComponent implements OnInit {
  public newPasswordForm: FormGroup;
  @Input() email = "";
  public password = "";
  public rePassword = "";
  public isLoading = false;
  public key = [];
  public isSuccess = false;

  constructor(
    public authService: AuthService,
    public fb: FormBuilder,
    public route: ActivatedRoute,
    public router: Router,
    public sharedService: SharedService
  ) {}

  ngOnInit() {
    this.key = this.route.snapshot.paramMap.get("key").split("-");
    this.isLoading = true;
    this.authService.checkPasswordChangeRequest(this.key).subscribe(
      res => {
        if (!res) {
          //  redirect to login
          this.isLoading = false;
          this.sharedService.addToast(
            "Not found",
            "Request not found!",
            "error"
          );
          this.router.navigate(["/login"]);
        } else {
          this.isLoading = false;
        }
      },
      error => {
        this.sharedService.addToast("Not found", "Request not found!", "error");
        this.router.navigate(["/login"]);
      }
    );
    this.newPasswordForm = this.fb.group(
      {
        password: ["", Validators.required],
        rePassword: ["", Validators.required]
      },
      {
        validator: Validators.compose([PasswordValidation.MatchPassword])
      }
    );
  }

  resetPassword(id, password) {
    if (this.newPasswordForm.valid) {
      this.authService.restPassword(id, password).subscribe(
        res => {
          // show success popup
          this.isSuccess = true;
          this.sharedService.addToast(
            "Successful",
            "Password changed successfully!",
            "success"
          );
        },
        error => {
          this.sharedService.addToast(
            "Error",
            "Error while changing password!",
            "error"
          );
        }
      );
    } else {
      this.markFormGroupTouched(this.newPasswordForm);
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
