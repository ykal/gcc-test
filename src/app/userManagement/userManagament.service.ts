import { Injectable } from "@angular/core";
import { ApiService } from "../shared/services/api.service";
import { AuthService } from "../Auth/services/auth.service";

@Injectable()
export class UserManagementService {
  constructor(
    private apiService: ApiService,
    private authService: AuthService
  ) {}

  getUser(userId) {
    return this.apiService.get(
      `UserAccounts/${userId}?filter={"include":["role","city"]}`
    );
  }

  activateDeactivateUser(userid, status) {
    return this.apiService.patch(`UserAccounts/${userid}`, status);
  }

  getRoles() {
    return this.apiService.get(`Icog-Roles/`);
  }

  getRegions() {
    return this.apiService.get(`Regions/`);
  }

  getCities() {
    return this.apiService.get(`cities/`);
  }

  updateStatus(patch) {
    return this.apiService.patch(
      `UserAccounts/${this.authService.getUserId()}`,
      patch
    );
  }

  updateProfile(user) {
    return this.apiService.patch(`UserAccounts/${user.id}`, user);
  }

  grantModeratorAccess(user) {
    return this.apiService.patch(`UserAccounts/${user.id}`, {
      isModerator: true
    });
  }

  detainModeratorAccess(user) {
    return this.apiService.patch(`UserAccounts/${user.id}`, {
      isModerator: false
    });
  }

  getUserList() {
    return this.apiService.get(`UserAccounts`);
  }

  assignCities(data) {
    return this.apiService.post('AssignedCities/assign', {data: data});
  }

  getAssignedCities(userId) {
    return this.apiService.get(`UserAccounts/${userId}/get-assigned-cities`);
  }
}
