import { Component, Input, OnInit } from "@angular/core";
import { ForumService } from "../forum.service";

@Component({
  selector: "member-list",
  templateUrl: "./memberList.component.html",
  styleUrls: ["./memberList.component.css"]
})
export class MemberList implements OnInit {
  @Input() forum;

  public members = [];
  public membersBackup = [];
  public keyword = "";
  public page = 1;

  constructor(public service: ForumService) {}

  ngOnInit() {
    this.getMembers();
  }

  getMembers() {
    this.service.getMembers(this.forum.id).subscribe(res => {
      this.members = res;
      this.membersBackup = res;
    });
  }

  searchMember() {
    if (this.keyword !== "") {
      this.members = this.membersBackup.filter(item =>
        item.email.includes(this.keyword)
      );
    } else {
      this.members = this.membersBackup.filter(item => item.pinned);
    }
  }
}
