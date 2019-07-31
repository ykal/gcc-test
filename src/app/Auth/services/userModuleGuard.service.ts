import { Injectable } from "@angular/core";
import { CanActivate, Router } from "@angular/router";
import { Observable } from "../../../../node_modules/rxjs";
import { AuthService } from "./auth.service";

@Injectable()
export class UserModuleGuardService implements CanActivate {
  constructor(public authService: AuthService, public router: Router) {}

  canActivate(): Observable<boolean> | Promise<boolean> | boolean {
    if (
      (this.authService.isAuthenticated() && this.authService.isAdmin()) ||
      this.authService.isSolveitManager()
    ) {
      return true;
    } else {
      if (
        this.authService.isAuthenticated() &&
        this.authService.isSolveitTeam
      ) {
        this.router.navigate(["dashboard/competitions"]);
        return false;
      } else {
        this.router.navigate([""]);
        return false;
      }
    }
  }
}
