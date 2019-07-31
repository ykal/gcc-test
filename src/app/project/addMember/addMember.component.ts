import { Component, Input, OnInit } from '@angular/core';
import { ProjectService } from '../project.service';
import { SharedService } from '../../shared/services/shared.service';
import { AuthService } from '../../Auth/services/auth.service';
import { CommonService } from '../../shared/services/common.service';

@Component({
  selector: 'app-add-project-member',
  templateUrl: './addMember.component.html',
  styleUrls: ['./addMember.component.css']
})
export class AddProjectMemberComponent implements OnInit {
  @Input() project;
  public users = [];
  public page = 1;
  public keyword = '';
  public members = [];

  constructor(
    public service: ProjectService,
    public forumService: CommonService,
    public sharedService: SharedService,
    public authService: AuthService
  ) {}

  ngOnInit() {
    this.getMembers();
  }

  addMember(user) {
    const member = {
      projectId: this.project.id,
      userId: user.id
    };
    this.service.addProjectMember(member).subscribe(
      res => {
        this.members.push(user);
        this.users.splice(this.users.indexOf(user), 1);
        this.sharedService.addToast('Success', 'New Member Added!.', 'success');
      },
      err => {
        if ((err.status = 422)) {
          this.sharedService.addToast('', 'Error occured!', 'error');
        }
      }
    );
  }

  getMembers() {
    this.service.getMembers(this.project.id).subscribe(res => {
      this.members = res;
    });
  }

  searchUser($event) {
    if (this.keyword.trim() !== '') {
      this.forumService.searchUser(this.keyword.trim(), this.authService.getUserId()).subscribe(res => {
        this.users = res.Result.filter(item => {
          return this.members.findIndex(x => x.id == item.id) == -1;
        });
      });
    } else {
      this.users = [];
    }
  }
}
