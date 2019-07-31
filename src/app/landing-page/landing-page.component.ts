import { Component, OnInit } from "@angular/core";
import { AuthService } from "../Auth/services/auth.service";
import { Router } from "@angular/router";
import { Http } from "@angular/http";

declare var $: any;

@Component({
  selector: "app-landing-page",
  templateUrl: "./landing-page.component.html",
  styleUrls: ["./landing-page.component.css"]
})
export class LandingPageComponent implements OnInit {
  news: any = [];

  constructor(
    public authService: AuthService,
    public router: Router,
    public http: Http
  ) {}

  ngOnInit() {}

  toggleMenu() {
    if ($("#menus").css("display") === "none") {
      $("#menus").css("display", "block");
      $("#menus").css("background", "white");
    } else {
      $("#menus").css("display", "none");
    }
  }
}
