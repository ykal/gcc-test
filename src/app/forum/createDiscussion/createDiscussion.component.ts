import {
  Component,
  OnInit,
  Input,
  EventEmitter,
  Output,
  OnChanges,
  SimpleChanges
} from "@angular/core";
import {
  FormGroup,
  Validators,
  FormBuilder,
  FormControl
} from "@angular/forms";
import { Router } from "@angular/router";
import { ForumService } from "../forum.service";
import { SharedService } from "../../shared/services/shared.service";
import { AuthService } from "../../Auth/services/auth.service";
import { configs } from "../../app.config";
import { FileItem, FileUploader, ParsedResponseHeaders } from "ng2-file-upload";

@Component({
  selector: "app-discussion-create",
  templateUrl: "./createDiscussion.component.html",
  styleUrls: ["./createDiscussion.component.css"]
})
export class CreateDiscussionComponent implements OnInit {
  @Input() isEdit = false;
  @Input() forum;
  @Output() created = new EventEmitter();
  @Input() discussion: any = {
    userAccountId: 0,
    forumId: 0,
    slung: "",
    title: "",
    imgContent: {}
  };
  public discussionForm: FormGroup;
  public tags = [];
  public discussionTags = [];
  public tag = "";
  public URL = `${configs.rootUrl}storages/discussions/upload`;
  public uploader: FileUploader = new FileUploader({ url: this.URL });
  public progress = 0;
  public isFileSelected = false;
  public selectedItems = [];
  public prevSelectedTags = [];

  dropdownSettings = {
    singleSelection: false,
    idField: "item_id",
    textField: "item_text",
    selectAllText: "Select All",
    unSelectAllText: "UnSelect All",
    itemsShowLimit: 3,
    allowSearchFilter: true
  };
  dropDownListTags = [];

  constructor(
    public authService: AuthService,
    public service: ForumService,
    public sharedService: SharedService,
    public router: Router
  ) {
    this.discussionForm = new FormGroup({
      title: new FormControl("", Validators.required),
      content: new FormControl("", Validators.required),
      tags: new FormControl("", Validators.required)
    });
  }

  ngOnInit() {
    this.getTags();
    if (this.isEdit) {
      // get tags for this discussion
      this.service.getDiscussionTags(this.discussion.id).subscribe(res => {
        this.populateSelectedTags(res);
        this.prevSelectedTags = this.discussionTags;
        this.selectedItems = this.mapTagsToDropDownList(res);
      });
      this.isFileSelected = true;
    }
    this.discussion.userAccountId = this.authService.getUserId()
      ? this.authService.getUserId()
      : 0;
    this.discussion.forumId = this.forum.id;
  }

  getTags() {
    this.service.getTags().subscribe(res => {
      this.tags = res;
    });
  }

  mapTagsToDropDownList(tags) {
    const list = [];
    tags.forEach(item => {
      list.push({ item_id: item.id, item_text: item.name });
    });
    return list;
  }

  onTagSelected(item) {
    if (this.discussionTags.indexOf(item.item_id) === -1) {
      this.discussionTags.push(item.item_id);
    }
  }

  populateSelectedTags(tags) {
    tags.forEach(tag => {
      if (this.discussionTags.indexOf(tag.id) === -1) {
        this.discussionTags.push(tag.id);
      }
    });
  }

  onTagDeselected(item) {
    this.discussionTags.slice(this.dropDownListTags.indexOf(item), 1);
  }

  onAllTagSelected(items) {
    items.forEach(item => {
      if (this.discussionTags.indexOf(item.item_id) === -1) {
        this.discussionTags.push(item.item_id);
      }
    });
  }

  onAllTagsDeselected(items) {
    this.discussionTags = [];
  }

  selectTag(tag) {
    if (this.discussionTags.indexOf(tag) !== -1) {
      this.discussionTags.splice(this.discussionTags.indexOf(tag), 1);
    } else {
      this.discussionTags.push(tag);
    }
  }

  addTag(discussionId, tagId) {
    this.service.addTagToDiscussion(discussionId, tagId).subscribe(res => {});
  }

  createDiscussion() {
    if (this.discussionForm.valid) {
      if (
        this.isFileSelected &&
        (!this.isEdit || (this.isEdit && this.uploader.queue.length > 0))
      ) {
        this.uploader.queue[this.uploader.queue.length - 1].upload();
        this.uploader.onSuccessItem = (
          item: FileItem,
          response: string,
          status: number,
          headers: ParsedResponseHeaders
        ) => {
          this.discussion["imgContent"] = JSON.parse(
            response
          ).result.files.file[0];
          if (this.isEdit) {
            this.editDiscussion();
          } else {
            this.onCreateDiscussion();
          }
          this.uploader.queue.pop();
        };
        this.uploader.onProgressItem = (fileItem: FileItem, progress: any) => {
          this.progress = progress;
        };
        this.uploader.onCancelItem = (
          item: FileItem,
          response: string,
          status: number,
          headers: ParsedResponseHeaders
        ) => {
          this.uploader.queue.pop();
        };
        this.uploader.onErrorItem = (
          item: FileItem,
          response: string,
          status: number,
          headers: ParsedResponseHeaders
        ) => {
          this.uploader.queue.pop();
        };
      } else {
        if (this.isEdit) {
          this.editDiscussion();
        } else {
          this.onCreateDiscussion();
        }
      }
    } else {
      this.mapTagsToDropDownList(this.discussionForm);
    }
  }

  public onCreateDiscussion() {
    this.discussion["forumId"] = this.forum.id;
    this.discussion.slung = this.discussion.title.replace(" ", "-");
    this.discussion.createdAt = new Date();
    this.service.createDiscussion(this.discussion).subscribe(
      res => {
        this.toggleDiscussionList();
        this.discussionTags.forEach(tag => {
          this.addTag(res.id, tag);
        });
        this.sharedService.addToast(
          "Success",
          "Discussion Created!.",
          "success"
        );
      },
      err => {
        if ((err.status = 422)) {
          this.sharedService.addToast("", "Error occured!", "error");
        }
      }
    );
  }

  editDiscussion() {
    this.discussion["forumId"] = this.forum.id;
    this.service.updateDiscussion(this.discussion).subscribe(
      res => {
        this.toggleDiscussionList();
        this.discussionTags.forEach(tag => {
          if (this.prevSelectedTags.indexOf(tag) === -1) {
            this.addTag(res.id, tag);
          }
        });
        this.sharedService.addToast(
          "Success",
          "Discussion Editted!.",
          "success"
        );
      },
      err => {
        if ((err.status = 422)) {
          this.sharedService.addToast("", "Error occured!", "error");
        }
      }
    );
  }

  toggleDiscussionList() {
    // this.created.emit();
    this.router.navigate(["forums"]);
  }

  onSignIn() {
    this.router.navigate(["login"]);
  }

  handleFileSelection($event) {
    this.isFileSelected = true;
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
