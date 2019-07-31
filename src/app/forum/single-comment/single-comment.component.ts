import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { ForumService } from "../forum.service";
import { AuthService } from "../../Auth/services/auth.service";
import { SharedService } from "../../shared/services/shared.service";
import { FormControl, FormGroup, Validators } from "@angular/forms";

@Component({
  selector: "app-single-comment",
  templateUrl: "./single-comment.component.html",
  styleUrls: ["./single-comment.component.css"]
})
export class SingleCommentComponent implements OnInit {
  @Input() comment: any = null;
  @Input() isOwnerOfDiscussion = false;
  @Output() remove = new EventEmitter();
  public isPostingReplyLoading = false;

  public isReplyActive = false;
  public reply = {
    "solveIT-Discussion-CommentId": !this.comment ? "" : this.comment.id,
    userId: "",
    content: ""
  };
  public replyForm: FormGroup;
  public replies = [];

  constructor(
    public service: ForumService,
    public authService: AuthService,
    public sharedService: SharedService
  ) {}

  ngOnInit() {
    this.replyForm = new FormGroup({
      content: new FormControl("", Validators.required)
    });
    this.getCommentReplies(this.comment);
  }

  getCommentReplies(comment) {
    this.service.getCommentReplies(comment.id).subscribe(res => {
      this.replies = res;
    });
  }

  toggleReplyForm() {
    this.isReplyActive = !this.isReplyActive;
  }

  removeComment(comment) {
    this.remove.emit({ comment: comment });
  }

  replyToComment() {
    const authenticated = this.authService.isAuthenticated();
    if (authenticated) {
      this.isPostingReplyLoading = true;
      const userId = this.authService.getUserId();
      if (userId) {
        this.reply = {
          ...this.reply,
          userId: userId,
          "solveIT-Discussion-CommentId": this.comment.id
        };
        this.service.replyToComment(this.reply).subscribe(
          res1 => {
            this.sharedService.addToast("Success", "Reply Added!.", "success");
            this.getCommentReplies(this.comment);
            this.replyForm.reset();
            this.isPostingReplyLoading = false;
          },
          err => {
            if ((err.status = 422)) {
              this.sharedService.addToast("", "Error occured!", "error");
              this.isPostingReplyLoading = false;
            }
          }
        );
      }
    } else {
      console.log("not authenticated");
    }
  }

  formatComment(comment) {
    if (comment.indexOf("\n") !== -1) {
      const temp = comment.split("\n");
      for (let i = 0; i < temp.length; i++) {
        const sentence = temp[i];
        if (
          sentence.indexOf("http://") !== -1 ||
          sentence.indexOf("www.") !== -1 ||
          sentence.indexOf("t.me") !== -1
        ) {
          temp[i] = `<a target="_blank" href="${sentence}">${sentence}</a>`;
        }
      }
      return temp.join("<br>");
    } else {
      if (
        comment.indexOf("http://") !== -1 ||
        comment.indexOf("www.") !== -1 ||
        comment.indexOf("t.me") !== -1
      ) {
        const temp = comment.split(" ");
        for (let i = 0; i < temp.length; i++) {
          const element = temp[i];
          if (
            element.indexOf("http://") !== -1 ||
            element.indexOf("www.") !== -1 ||
            element.indexOf("t.me") !== -1
          ) {
            if (element.indexOf("t.me") !== -1) {
              temp[
                i
              ] = `<a target="_blank" href="https://${element}">${element}</a>`;
            } else {
              temp[i] = `<a target="_blank" href="${element}">${element}</a>`;
            }
          }
        }
        return temp.join(" ");
      }
      return comment;
    }
  }
}
