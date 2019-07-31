import { Component, OnInit, Input, EventEmitter, Output } from "@angular/core";
import { Router } from "@angular/router";
import { ForumService } from "../forum.service";
import { AuthService } from "../../Auth/services/auth.service";
import { retry } from "rxjs/operator/retry";
import { OnChanges } from "@angular/core/src/metadata/lifecycle_hooks";
import { SimpleChange } from "@angular/core/src/change_detection/change_detection_util";
import { NgxSpinnerService } from "ngx-spinner";

@Component({
  selector: "app-forum-list",
  templateUrl: "./forumList.component.html",
  styleUrls: ["./forumList.component.css"]
})
export class ForumListComponent implements OnInit, OnChanges {
  @Input() selected;
  @Input() categories;
  @Output() create = new EventEmitter();

  public popularforums = [];
  public forumsBackup = [];
  public forums = [];
  // public keyword = '';
  public forumType = "";
  public page = 1;
  public discussionCounts = {};
  @Input() keyword;

  constructor(
    public service: ForumService,
    public router: Router,
    public authService: AuthService,
    private spinner: NgxSpinnerService
  ) {}

  ngOnInit() {
    this.fetchForumsList();
  }

  ngOnChanges(changes) {
    this.onSearch();
  }

  fetchForumsList() {
    this.spinner.show();
    this.discussionCounts = [];
    if (this.selected === "forum-list-public") {
      this.service.getAllForumList().subscribe(
        res => {
          this.forumsBackup = res.filter(forum => {
            return !forum.private;
          });
          this.forumsBackup.forEach(item => {
            this.getForumDiscussionCount(item.id);
          });
          this.forums = this.forumsBackup;
          this.spinner.hide();
        },
        error => {
          this.spinner.hide();
        }
      );
    } else if (this.selected === "forum-list-private") {
      const userId = this.authService.getUserId();
      if (userId) {
        this.service.getMyForumList(userId).subscribe(
          forums => {
            this.forums = forums.filter(forum => {
              return forum.private;
            });
            this.forumsBackup = this.forums;
            this.forumsBackup.forEach(item => {
              this.getForumDiscussionCount(item.id);
              this.spinner.hide();
            });
            this.spinner.hide();
          },
          error => {
            this.spinner.hide();
          }
        );
      }
    }
  }

  getForumDiscussionCount(forumId) {
    this.service.getDiscussionCount(forumId).subscribe(
      res => {
        this.discussionCounts[forumId] = res.count;
      },
      error => {
        this.discussionCounts[forumId] = 0;
      }
    );
  }

  viewForum(slung) {
    this.router.navigate(["/forums", slung]);
  }

  onSearch() {
    if (this.keyword !== "") {
      if (this.forums.length === 0) {
        this.forums = this.forumsBackup;
      }
      this.forums = this.forums.filter(item =>
        item.slung.toUpperCase().includes(this.keyword.toUpperCase())
      );
    } else {
      this.forums = this.forumsBackup;
    }
  }

  onCreateForum() {
    this.create.emit();
  }
}
