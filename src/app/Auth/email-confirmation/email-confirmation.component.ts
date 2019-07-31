import { Component, OnInit, OnDestroy } from "@angular/core";
import { AuthService } from "../services/auth.service";
import { ActivatedRoute, Router } from "@angular/router";
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: "app-email-confirmation",
  templateUrl: "./email-confirmation.component.html",
  styleUrls: ["./email-confirmation.component.css"]
})
export class EmailConfirmationComponent implements OnInit, OnDestroy {

  public param: string;
  public loading = true;
  public error = false;

  constructor(
    public authService: AuthService,
    public route: ActivatedRoute,
    public router: Router,
    public spinner: NgxSpinnerService
  ) {}

  ngOnInit() {
    this.spinner.show();
    this.route.params.subscribe(res => {
      this.param = res.id;
      // split the userId and cId
      const temp = this.param.split("-");
      this.authService.confirmEmail(temp[0], temp[1]).subscribe(
        res1 => {
          this.loading = false;
          this.spinner.hide();
          this.router.navigate(["login"]);
        },
        err => {
          this.loading = false;
          this.spinner.hide();
        }
      );
    });
  }

  ngOnDestroy() {
    this.loading = false;
  }

  
}
