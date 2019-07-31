import { Component, OnInit } from "@angular/core";
import { NavigationEnd, Router } from "@angular/router";
import "rxjs/add/operator/distinctUntilChanged";
import { FacebookService, InitParams } from "ngx-facebook";

declare var gtag: Function;

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.css"]
})
export class AppComponent implements OnInit {
  constructor(public router: Router, private fb: FacebookService) {}

  ngOnInit(): void {
    let initParams: InitParams = {
      appId: "578025749345388",
      xfbml: true,
      cookie: true,
      version: "v3.2"
    };

    this.fb.init(initParams);
    this.router.events
      .distinctUntilChanged((previous: any, current: any) => {
        if (current instanceof NavigationEnd) {
          return previous.url === current.url;
        }
        return true;
      })
      .subscribe((x: any) => {
        gtag("config", "UA-129320736-1", { page_path: x.url });
      });
  }
}
