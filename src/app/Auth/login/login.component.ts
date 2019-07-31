import { Component, OnInit } from "@angular/core";
import { AuthService } from "../services/auth.service";
import { Router } from "@angular/router";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { NgxSpinnerService } from "ngx-spinner";
import { FacebookService, InitParams, LoginResponse } from "ngx-facebook";

@Component({
  selector: "app-login",
  templateUrl: "./login.component.html",
  styleUrls: ["./login.component.css"]
})
export class LoginComponent implements OnInit {
  public loginForm: FormGroup;
  public loginError = false;
  public loginErrorMsg = "Incorrect email or password.";
  public user = {
    email: "",
    password: ""
  };
  public ICOG_ROLE = [
    "solve-it-mgt",
    "solve-it-team",
    "solve-it-participants",
    "admin"
  ];
  public isLoading = false;

  constructor(
    public authService: AuthService,
    public router: Router,
    private spinner: NgxSpinnerService,
    private fb: FacebookService
  ) {
    // let initParams: InitParams = {
    //   appId: "578025749345388",
    //   xfbml: true,
    //   cookie: true,
    //   version: "v3.2"
    // };
    // fb.init(initParams);
  }

  ngOnInit() {
    this.loginForm = new FormGroup({
      email: new FormControl("", Validators.required),
      password: new FormControl("", Validators.required)
    });
  }

  onLogin() {
    if (this.loginForm.valid) {
      this.spinner.show();
      this.isLoading = true;
      this.user.email = this.user.email.toLowerCase();
      this.authService.login(this.user).subscribe(
        res => {
          this.authService.setSession(res);
          this.isLoading = false;
          this.authService.getUserRole(res.userId).subscribe(res1 => {
            if (res1.name === this.ICOG_ROLE[2]) {
              this.router.navigate(["/my-projects"]);
            } else {
              this.router.navigate(["/dashboard"]);
            }
          });
          this.spinner.hide();
        },
        error1 => {
          this.loginError = true;
          if (error1.status === 500) {
            this.loginErrorMsg = "User not found!";
          } else {
            this.loginErrorMsg = "Incorrect email or password.";
          }
          this.isLoading = false;
          this.spinner.hide();
        }
      );
    } else {
      this.markFormGroupTouched(this.loginForm);
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

  forgetPassword() {
    this.router.navigate(["/forget-password"]);
  }

  loginWithFB() {
    this.fb
      .login()
      .then((response: LoginResponse) => {
        this.spinner.show();
        this.authService.loginWithFB(response).subscribe(
          res => {
            if (!res.error) {
              this.authService.setSession(res);
              this.isLoading = false;
              this.authService.getUserRole(res.userId).subscribe(res1 => {
                if (res1.name === this.ICOG_ROLE[2]) {
                  this.router.navigate(["/my-projects"]);
                } else {
                  this.router.navigate(["/dashboard"]);
                }
              });
              this.spinner.hide();
            }
          },
          error => {
            this.loginError = true;
            this.loginErrorMsg =
              "Your account is not registered. please register your account before login.";
            this.isLoading = false;
            this.spinner.hide();
          }
        );
      })
      .catch((error: any) => console.error(error));
  }

  signupWithFB() {
    this.fb
      .login()
      .then((response: LoginResponse) => {
        this.fb
          .api(response.authResponse.userID, "get", {
            fields:
              "id,email,first_name,middle_name,name, last_name, gender,education,birthday,age_range,address,hometown"
          })
          .then(res => {
            res["fbStatus"] = JSON.stringify(response);
            this.router.navigate(["/register"], { queryParams: res });
          });
      })
      .catch((error: any) => console.error(error));
  }
}
