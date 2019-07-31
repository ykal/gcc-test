import { Component, OnInit } from "@angular/core";
import { Router, ActivatedRoute, ParamMap } from "@angular/router";
import { UserManagementService } from "../userManagament.service";
import { SharedService } from "../../shared/services/shared.service";
import { AuthService } from "../../Auth/services/auth.service";
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: "app-user-profile",
  templateUrl: "userProfile.component.html",
  styleUrls: ["userProfile.component.css"]
})
export class UserProfileComponent implements OnInit {
  public userId: any;
  public user: any;
  public disabled = true;
  views = ['profile', 'editProfile'];
  public selected = this.views[0];
  public updatedUser = null;

  constructor(
    private spinner: NgxSpinnerService,
    public service: UserManagementService,
    public sharedService: SharedService,
    public route: ActivatedRoute,
    public router: Router,
    public authService: AuthService
  ) {}

  ngOnInit() {
    this.userId = this.route.snapshot.paramMap.get("userId");
    this.getUser();
  }

  toggleProfileView() {
    this.selected = this.views[0];
    this.updatedUser = {
      firstName: this.user.firstName,
      middleName: this.user.middleName,
      lastName: this.user.lastName,
      phoneNumber: this.user.phoneNumber,
      username: this.user.username,
      cityId: this.user.cityId,
      id: this.user.id,
      birthDate: this.user.birthDate,
      gender: this.user.gender
    };
  }

  getUser() {
    this.spinner.show();
    this.service.getUser(this.userId).subscribe(
      res => {
        this.user = res;
        this.updatedUser =  {
          firstName: this.user.firstName,
          middleName: this.user.middleName,
          lastName: this.user.lastName,
          phoneNumber: this.user.phoneNumber,
          username: this.user.username,
          cityId: this.user.cityId,
          id: this.user.id,
          birthDate: this.user.birthDate,
          gender: this.user.gender,
          city: this.user.city
        };
        this.spinner.hide();
        this.selected = this.views[0];
      },
      err => {
        this.router.navigate(["/404"]);
        this.spinner.hide();
      }
    );
  }

  toggleView(view) {
    this.selected = view;
  }

  updateStatus(status) {
    const patch = { userType: status };
    this.service.updateStatus(patch).subscribe(
      res => {
        this.sharedService.addToast("Success", "Status Updated!.", "success");
        this.user.userType = status;
      },
      err => {
        this.sharedService.addToast("", "Error occured!", "error");
      }
    );
  }
}
