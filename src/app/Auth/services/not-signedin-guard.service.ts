import {Injectable} from '@angular/core';
import {AuthService} from './auth.service';
import {CanActivate, Router} from '@angular/router';

@Injectable()
export class NotSignedinGuardService implements CanActivate{
  constructor(public authService: AuthService, public router: Router) {
  }

  canActivate() {
    if (this.authService.isAuthenticated()) {
      this.router.navigate(['']);
      return false;
    }
    return true;
  }
}
