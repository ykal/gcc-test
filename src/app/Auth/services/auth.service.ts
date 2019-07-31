import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { ApiService } from "../../shared/services/api.service";
import { from } from "../../../../node_modules/rxjs/observable/from";

@Injectable()
export class AuthService {
  public TOKEN = "access_token";
  public SESSION = "session";
  public user_Path = "UserAccounts";
  public login_path = "UserAccounts/login";
  public logout_path = "UserAccounts/logout";
  public register_path = "UserAccounts/register-participants";
  public register_mgt_path = "UserAccounts/register-solveit-mgt";
  public register_team_path = "UserAccounts/register-solveit-team";

  public ICOG_ROLE = [
    "solve-it-mgt",
    "solve-it-team",
    "solve-it-participants",
    "admin"
  ];

  constructor(public router: Router, public apiService: ApiService) {}

  setSession(data: any) {
    this.getUserRole(data.userId).subscribe(res => {
      data["role"] = res.name;
      window.localStorage.setItem(this.TOKEN, JSON.stringify(data));
    });
  }

  isTokenExpired(key: string) {
    try {
      const data = JSON.parse(window.localStorage.getItem(key));
      if (data != null) {
        const exp_date = new Date(data.created);
        exp_date.setDate(exp_date.getDate() + data.ttl / (60 * 60 * 24));
        return exp_date < new Date();
      } else {
        return true;
      }
    } catch (e) {
      return true;
    }
  }

  login(user) {
    return this.apiService.post(`${this.login_path}`, user);
  }

  getUserRole(id) {
    return this.apiService.get(`${this.user_Path}/${id}/role`);
  }

  getUserInfo(userId) {
    return this.apiService.get(`UserAccounts/${userId}`);
  }

  getUserId() {
    const temp = window.localStorage.getItem(this.TOKEN);
    if (temp != null) {
      const session = JSON.parse(temp);
      return session.userId;
    }
    return false;
  }

  getUserSession() {
    const temp = window.localStorage.getItem(this.TOKEN);
    if (temp != null) {
      const session = JSON.parse(temp);
      return session;
    }
    return false;
  }

  signOut() {
    if (this.isAuthenticated()) {
      // this.apiService.post(`${this.logout_path}`, {})
      //   .subscribe(res => {
      //     this.router.navigate(['']);
      //   }, err => {
      //  });
      window.localStorage.removeItem(this.TOKEN);
      this.router.navigate([""]);
    }
  }

  register(user) {
    return this.apiService.post(`${this.register_path}`, user);
  }

  isAuthenticated(): boolean {
    try {
      return !this.isTokenExpired(this.TOKEN);
    } catch (e) {
      return false;
    }
  }

  isSolveitManager() {
    try {
      const data = JSON.parse(window.localStorage.getItem(this.TOKEN));
      return data.role === this.ICOG_ROLE[0];
    } catch (e) {
      return false;
    }
  }

  isAdmin() {
    try {
      const data = JSON.parse(window.localStorage.getItem(this.TOKEN));
      return data.role === this.ICOG_ROLE[3];
    } catch (e) {
      return false;
    }
  }

  isSolveitTeam() {
    try {
      const data = JSON.parse(window.localStorage.getItem(this.TOKEN));
      return data.role === this.ICOG_ROLE[1];
    } catch (e) {
      return false;
    }
  }

  isSolveitParticipant() {
    try {
      const data = JSON.parse(window.localStorage.getItem(this.TOKEN));
      return data.role === this.ICOG_ROLE[2];
    } catch (e) {
      return false;
    }
  }

  addUser(user, role) {
    if (role === this.ICOG_ROLE[0]) {
      return this.apiService.post(this.register_mgt_path, user);
    } else if (role === this.ICOG_ROLE[1]) {
      return this.apiService.post(this.register_team_path, user);
    } else if (role === this.ICOG_ROLE[2]) {
      return this.apiService.post(this.register_path, user);
    }
  }

  confirmEmail(userId, cid) {
    return this.apiService.post(`${this.user_Path}/confirmEmail`, {
      userId,
      cid
    });
  }

  requestPasswordChange(email) {
    return this.apiService.post(`${this.user_Path}/request-password-change`, {
      email: email
    });
  }

  restPassword(id, password) {
    const temp = {
      id: id,
      password: password
    };

    return this.apiService.post(`${this.user_Path}/update-password`, temp);
  }

  checkPasswordChangeRequest(key) {
    return this.apiService.post(`${this.user_Path}/change-password`, {
      key: key
    });
  }

  isEmailUnique(email) {
    return this.apiService.post(`${this.user_Path}/is-email-unique`, {
      email: email
    });
  }

  loginWithFB(user) {
    return this.apiService.post(`${this.user_Path}/signInWithFB`, {
      user: user
    });
  }
}
