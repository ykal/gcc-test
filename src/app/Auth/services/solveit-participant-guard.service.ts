import {Injectable} from '@angular/core';
import {CanActivate, Router} from '@angular/router';
import {Observable} from '../../../../node_modules/rxjs';
import {AuthService} from './auth.service';

@Injectable()
export class SolveitParticipantGuardService implements CanActivate {

  constructor(public authService: AuthService, public router: Router) {}

  canActivate(): Observable<boolean> | Promise<boolean> | boolean {
    if (this.authService.isAuthenticated() && this.authService.isSolveitParticipant()) {
      return true;
    } else {
      this.router.navigate(['']);
      return false;
    }
  }

}
