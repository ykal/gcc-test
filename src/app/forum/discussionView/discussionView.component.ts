import {
  Component,
  OnInit,
  Input,
  Output,
  EventEmitter,
  OnChanges,
  SimpleChanges
} from "@angular/core";
import {
  FormGroup,
  Validators,
  FormBuilder,
  FormControl
} from "@angular/forms";
import { ForumService } from "../forum.service";
import { ActivatedRoute, Router } from "@angular/router";
import { AuthService } from "../../Auth/services/auth.service";
import { SharedService } from "../../shared/services/shared.service";
import { configs } from "../../app.config";
import { NgxSpinnerService } from "ngx-spinner";

@Component({
  selector: "app-discussion-view",
  templateUrl: "./discussionView.component.html",
  styleUrls: ["./discussionView.component.css"]
})
export class DiscussionViewComponent implements OnInit, OnChanges {
  ngOnChanges(changes: SimpleChanges): void {}
  public numberOfComments: any;
  public discussion = {
    id: 0,
    isBlackListed: false,
    userAccountId: "",
    forumId: ""
  };
  public comment = { solveitdiscussionId: this.discussion.id, userId: 0 };
  public commentForm: FormGroup;
  public comments = [];
  public postedBy = null;
  public isBlackListed = false;
  public favoriteDiscussions = [];
  // @Input() slung = '';
  public slung = "";
  public tags = [];
  public isPostingCommentLoading = false;

  constructor(
    public route: ActivatedRoute,
    public router: Router,
    public service: ForumService,
    public authService: AuthService,
    public sharedService: SharedService,
    private spinner: NgxSpinnerService
  ) {
    this.commentForm = new FormGroup({
      content: new FormControl("", Validators.required)
    });
  }

  onEdit() {
    this.service.getForumById(this.discussion.forumId).subscribe(
      res => {
        this.discussion["forum"] = JSON.stringify(res);
        this.router.navigate([`forums/${res.slung}`], {
          queryParams: this.discussion
        });
      },
      error => {
        this.sharedService.addToast("", "Error occured!", "error");
      }
    );
  }

  ngOnInit() {
    this.route.params.subscribe(res => {
      this.slung = res.slung;
    });
    if (this.slung !== "") {
      this.getDiscussion(this.slung);
    }
  }

  isOwnerOfDiscussion() {
    const userId = this.authService.getUserId();
    if (userId) {
      if (this.discussion.userAccountId === userId) {
        return true;
      }
      return false;
    }
    return false;
  }

  getTags(discussionId) {
    this.service.getDiscussionTags(discussionId).subscribe(res => {
      this.tags = res;
    });
  }

  getFavoriteDiscusions() {
    this.favoriteDiscussions = [];
    const userId = this.authService.getUserId();
    if (userId) {
      this.service.getFavouriteDiscussions(userId).subscribe(res => {
        res.forEach(item => {
          this.favoriteDiscussions.push(item.id);
        });
      });
    }
  }

  getDiscussion(slung) {
    this.spinner.show();
    this.service.getDiscussion(slung).subscribe(
      res => {
        if (res.Result) {
          this.postedBy = res.Result.user;
          this.discussion = res.Result.discussion;
          this.getTags(this.discussion.id);
          this.countComments();
          this.getComments();
          this.getFavoriteDiscusions();
          this.isUserBlackListedDiscussion(this.discussion.id);
          this.spinner.hide();
        } else {
          this.router.navigate(["/404"]);
          this.spinner.hide();
        }
      },
      err => {
        this.spinner.hide();
        this.router.navigate(["/404"]);
      }
    );
  }

  countComments() {
    this.service.countComments(this.discussion.id).subscribe(res => {
      this.numberOfComments = res.count;
    });
  }

  addComment() {
    this.isPostingCommentLoading = true;
    const authenticated = this.authService.isAuthenticated();
    if (authenticated) {
      const userId = this.authService.getUserId();
      if (userId) {
        this.comment.userId = userId;
        this.comment.solveitdiscussionId = this.discussion.id;

        this.service.addComment(this.comment).subscribe(
          res1 => {
            this.sharedService.addToast(
              "Success",
              "Comment Added!.",
              "success"
            );
            this.isPostingCommentLoading = false;
            this.getComments();
            this.countComments();
            this.commentForm.reset();
          },
          err => {
            if ((err.status = 422)) {
              this.sharedService.addToast("", "Error occured!", "error");
              this.isPostingCommentLoading = false;
            }
          }
        );
      }
    }
  }

  isUserBlackListedDiscussion(discussionId) {
    const userId = this.authService.getUserId();
    if (userId) {
      this.service.isUserBlackListedDiscussion(userId, discussionId).subscribe(
        res => {
          this.isBlackListed = true;
        },
        error => {
          this.isBlackListed = false;
        }
      );
      this.isBlackListed = false;
    }
    this.isBlackListed = false;
  }

  addToFavorites() {
    const userId = this.authService.getUserId();
    if (userId) {
      const content = {
        discussionId: this.discussion.id,
        userId: userId
      };
      this.service.addToFavourites(content).subscribe(
        res => {
          this.favoriteDiscussions.push(this.discussion.id);
          this.sharedService.addToast(
            "Success",
            "Added To Favourites!.",
            "success"
          );
        },
        error1 => {
          this.sharedService.addToast("", "Error occured!", "error");
        }
      );
    }
  }

  removeFromFavorites() {
    const userId = this.authService.getUserId();
    if (userId) {
      this.service.removeFromFavorites(userId, this.discussion.id).subscribe(
        res => {
          this.sharedService.addToast(
            "Success",
            "Removed From Favourites!.",
            "success"
          );
          this.favoriteDiscussions.splice(
            this.favoriteDiscussions.indexOf(this.discussion.id),
            1
          );
        },
        error => {
          this.sharedService.addToast("", "Error occured!", "error");
        }
      );
    }
  }

  isFavorite(discussion) {
    return this.favoriteDiscussions.indexOf(discussion.id) !== -1;
  }

  getComments() {
    this.service.getComments(this.discussion.id).subscribe(res => {
      this.comments = res;
    });
  }

  removeFromBlackList() {
    const userId = this.authService.getUserId();
    if (userId) {
      this.service
        .removeFromBlackList({ userId, discussionId: this.discussion.id })
        .subscribe(
          res => {
            this.sharedService.addToast(
              "Success",
              "Remove from black list!.",
              "success"
            );
            this.isBlackListed = false;
          },
          error => {
            this.sharedService.addToast("", "Error occured!", "error");
          }
        );
    }
  }

  blackList() {
    const userId = this.authService.getUserId();
    if (userId) {
      const content = { userId: userId, discussionId: this.discussion.id };
      this.service.blackList(content).subscribe(
        res => {
          this.sharedService.addToast("Reported", "Black Listed!.", "error");
          this.isBlackListed = true;
        },
        error => {
          this.sharedService.addToast("", "Error occured!", "error");
        }
      );
    }
  }

  onSignIn() {
    this.router.navigate(["login"]);
  }

  getImageSource(image) {
    return `${configs.rootUrl}storages/discussions/download/${image}`;
  }

  isDiscussionOwner(userId) {
    let currentUserId = this.authService.getUserId();
    return currentUserId === userId;
  }
}
