import { Component, OnInit } from "@angular/core";
import { AuthService } from "../Auth/services/auth.service";
import { Router } from "@angular/router";

@Component({
  selector: "app-dashboard",
  templateUrl: "./dashboard.component.html",
  styleUrls: ["./dashboard.component.css"]
})
export class DashboardComponent implements OnInit {
  public views = [
    "users",
    "competitions",
    "categories",
    "tags",
    "reviewDiscussions",
    "city",
    "exportData"
  ];
  public selected = this.views[0];
  public isModerator: any;

  constructor(public authService: AuthService, public router: Router) {}

  toggleView(view) {
    this.selected = view;
  }

  ngOnInit(): void {
    // if (this.authService.isAdmin() || this.authService.isSolveitManager()) {
    //   this.router.navigate(['dashboard/users']);
    // } else {
    //   this.router.navigate(['dashboard/competitions']);
    // }
    this.authService
      .getUserInfo(this.authService.getUserId())
      .subscribe(res => {
        this.isModerator = res.isModerator;
      });
    this.selected =
      this.authService.isAdmin() || this.authService.isSolveitManager()
        ? this.views[0]
        : this.views[1];
  }
}
