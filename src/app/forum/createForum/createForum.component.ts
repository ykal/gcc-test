import { Component, OnInit, Input, Output, EventEmitter } from "@angular/core";
import {
  FormGroup,
  Validators,
  FormBuilder,
  FormControl
} from "@angular/forms";
import { ForumService } from "../forum.service";
import { AuthService } from "../../Auth/services/auth.service";
import { SharedService } from "../../shared/services/shared.service";
import { Router } from "@angular/router";

@Component({
  selector: "app-forum-create",
  templateUrl: "./createForum.component.html",
  styleUrls: ["./createForum.component.css"]
})
export class CreateForumComponent {
  @Input() categories;
  @Output() created = new EventEmitter();
  public forum = {
    userAccountId: 0,
    created: new Date(),
    name: "",
    slung: "",
    categoryId: "",
    private: "",
    description: ""
  };
  public forumForm: FormGroup;

  constructor(
    public service: ForumService,
    public authService: AuthService,
    public sharedService: SharedService,
    public router: Router
  ) {
    this.forumForm = new FormGroup({
      name: new FormControl("", Validators.required),
      category: new FormControl("", Validators.required),
      type: new FormControl("", Validators.required),
      description: new FormControl("", Validators.required)
    });
  }

  createForum() {
    if (this.forumForm.valid) {
      this.forum.created = new Date();
      this.forum.slung = this.forum.name
        .trim()
        .split(" ")
        .join("-");
      this.service.createForum(this.forum).subscribe(
        res => {
          const forumId = res.id;
          this.created.emit();
          const userId = this.authService.getUserId();
          if (userId) {
            const member = {
              forumId: forumId,
              userId: userId
            };
            this.service.addMember(member).subscribe(res2 => {
            });
          }
        },
        err => {
          if ((err.status = 422)) {
            this.sharedService.addToast("", "Error occured!", "error");
          }
        }
      );
    } else {
      this.markFormGroupTouched(this.forumForm);
    }
  }

  onSignIn() {
    this.router.navigate(["login"]);
  }

  /**
   * Marks all controls in a form group as touched
   * @param formGroup - The form group to touch
   */
  private markFormGroupTouched(formGroup: any) {
    (<any>Object).values(formGroup.controls).forEach(control => {
      control.markAsTouched();

      if (control.controls) {
        this.markFormGroupTouched(control);
      }
    });
  }
}
