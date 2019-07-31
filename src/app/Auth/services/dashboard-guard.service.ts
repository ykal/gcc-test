import { Injectable } from "@angular/core";
import { AuthService } from "./auth.service";
import { CanActivate, Router } from "@angular/router";
import { Observable } from "../../../../node_modules/rxjs";

@Injectable()
export class DashboardGuardService implements CanActivate {
  constructor(public authService: AuthService, public router: Router) {}

  canActivate(): Observable<boolean> | Promise<boolean> | boolean {
    if (
      this.authService.isAuthenticated() &&
      (this.authService.isAdmin() ||
        this.authService.isSolveitManager() ||
        this.authService.isSolveitTeam() ||
        this.authService.isAdmin())
    ) {
      return true;
    } else {
      this.router.navigate([""]);
      return false;
    }
  }
}
