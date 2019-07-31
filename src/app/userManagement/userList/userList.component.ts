import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { UserManagementService } from '../userManagament.service';
import { SharedService } from '../../shared/services/shared.service';
import { AuthService } from '../../Auth/services/auth.service';
import { NgxSpinnerService } from 'ngx-spinner';
declare var $: any;

@Component({
  selector: 'app-user-list',
  templateUrl: 'userList.component.html',
  styleUrls: ['userList.component.css']
})
export class UserListComponent implements OnInit {
  @Output() create = new EventEmitter();
  public selected = '0';
  public page = 1;
  public keyword = '';
  public backupUsers = [];
  public allUsers = [];
  public selectedUsers = [];
  public views = [
    { name: 'solveitmgmt', id: '' },
    { name: 'solveitteam', id: '' },
    { name: 'participant', id: '' }
  ];
  public cities = [];
  public selectedRole = this.views[0];
  public selectedCity = 0;
  public selectedStatus = '';
  public selectedMentorUser = null;

  constructor(
    public service: UserManagementService,
    public sharedService: SharedService,
    public router: Router,
    private spinner: NgxSpinnerService
  ) {}

  ngOnInit() {
    this.populateUsersList();
    this.getCities();
  }

  getAllUsers() {
    this.service.getUserList().subscribe(res => {
      this.allUsers = res;
      this.filterUsers();
    }, error => {
      this.spinner.hide();
    });
  }

  getCities() {
    this.service.getCities().subscribe(res => {
      this.cities = res;
    });
  }

  populateUsersList() {
    this.spinner.show();
    this.service.getRoles().subscribe(res => {
      for (let i = 0; i < res.length; ++i) {
        if (res[i].name === 'solve-it-team') {
          this.views[1].id = res[i].id;
        } else if (res[i].name === 'solve-it-mgt') {
          this.views[0].id = res[i].id;
        } else if (res[i].name === 'solve-it-participants') {
          this.views[2].id = res[i].id;
        }
      }
      this.getAllUsers();
    });
  }

  activateUser(user) {
    this.service.activateDeactivateUser(user.id, {status: 'ACTIVE'}).subscribe(
      res => {
        this.sharedService.addToast('Success', 'Account Activated!', 'success');
        this.allUsers[this.allUsers.indexOf(user)].status = 'ACTIVE';
      },
      err => {
        if ((err.status = 422)) {
          this.sharedService.addToast('', 'Error occured!', 'error');
        }
      }
    );
  }

  deactivateUser(user) {
    this.service.activateDeactivateUser(user.id, {status: 'INACTIVE'}).subscribe(
      res => {
        this.sharedService.addToast(
          'Success',
          'Account Deactivated!',
          'success'
        );
        this.allUsers[this.allUsers.indexOf(user)].status = 'INACTIVE';
      },
      err => {
        if ((err.status = 422)) {
          this.sharedService.addToast('', 'Error occured!', 'error');
        }
      }
    );
  }

  toggleView(index: string) {
    this.page = 1;
    this.selectedRole = this.views[parseInt(index)];
    this.filterUsers();
  }

  filterUsers() {
    if (this.selectedRole.name === 'participant') {
      if (parseInt(this.selectedCity.toString()) === 0) {
        this.selectedUsers = this.allUsers.filter(item => {
          if (this.selectedStatus === 'confirmed') {
            return item.roleId === this.selectedRole.id && item.emailVerified;
          } else if (this.selectedStatus === 'unconfirmed') {
            return item.roleId === this.selectedRole.id && !item.emailVerified;
          } else {
            return item.roleId === this.selectedRole.id;
          }
        });
      } else {
        this.selectedUsers = this.allUsers.filter(item => {
          if (this.selectedStatus === 'confirmed') {
            return (
              item.roleId === this.selectedRole.id &&
              item.cityId === this.selectedCity.toString() &&
              item.emailVerified
            );
          } else if (this.selectedStatus === 'unconfirmed') {
            return (
              item.roleId === this.selectedRole.id &&
              item.cityId === this.selectedCity.toString() &&
              !item.emailVerified
            );
          } else {
            return (
              item.roleId === this.selectedRole.id &&
              item.cityId === this.selectedCity.toString()
            );
          }
        });
      }
    } else {
      this.selectedUsers = this.allUsers.filter(item => {
        return item.roleId === this.selectedRole.id;
      });
    }
    this.backupUsers = this.selectedUsers;
    this.spinner.hide();
  }

  searchUser($event) {
    if (this.keyword !== '') {
      this.selectedUsers = this.backupUsers.filter(item => {
        return (
          item.email.toUpperCase().includes(this.keyword.toUpperCase()) ||
          item.firstName.toUpperCase().includes(this.keyword.toUpperCase()) ||
          item.middleName.toUpperCase().includes(this.keyword.toUpperCase()) ||
          item.lastName.toUpperCase().includes(this.keyword.toUpperCase())
        );
      });
    } else {
      this.selectedUsers = this.backupUsers;
    }
  }

  createUser() {
    this.create.emit();
  }

  viewUserProfile(user) {
    this.router.navigate(['dashboard/userProfile/', user.id]);
  }

  verifyEmail(user) {
    let verifiedUser = user;
    verifiedUser.emailVerified = true;
    if (verifiedUser.address === 'None') {
      verifiedUser.address = {};
    }
    if (verifiedUser.birthDate === 'None') {
      verifiedUser.birthDate = null;
    }
    this.service.updateProfile(verifiedUser)
      .subscribe(res => {
        if (res.error) {
          this.sharedService.addToast('', 'Error occurred!', 'error');
        } else {
          this.sharedService.addToast('', 'Confirmed Successfully!', 'success');
          if (this.selectedRole.name === 'participant') {
            this.selectedUsers.splice(this.selectedUsers.indexOf(user), 1);
          }
        }
      }, error => {
        this.sharedService.addToast('', 'Error occurred!', 'error');
      });
  }

  processModerator(user) {
    if (!user.isModerator) {
      this.service.grantModeratorAccess(user).subscribe(
        res => {
          this.sharedService.addToast(
            'Success',
            'Moderator Access Granted!',
            'success'
          );
          user.isModerator = true;
        },
        err => {
          if ((err.status = 422)) {
            this.sharedService.addToast('', 'Error occurred!', 'error');
          }
        }
      );
    } else {
      this.service.detainModeratorAccess(user).subscribe(
        res => {
          this.sharedService.addToast(
            'Success',
            'Moderator Access Detained!',
            'success'
          );
          user.isModerator = false;
        },
        err => {
          if ((err.status = 422)) {
            this.sharedService.addToast('', 'Error occurred!', 'error');
          }
        }
      );
    }
  }

  showModal(user) {
    this.selectedMentorUser = user;
    $("#assignRegionModal").modal("show");
  }

  onAssignRegionDone() {
    this.selectedMentorUser = null;
    $("#assignRegionModal").modal("hide");
  }
}
