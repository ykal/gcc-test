import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { FileItem, FileUploader, ParsedResponseHeaders } from "ng2-file-upload";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { ProjectService } from "../project.service";
import { configs } from "../../app.config";
import { Router } from "@angular/router";
import { SharedService } from "../../shared/services/shared.service";
import { AuthService } from "../../Auth/services/auth.service";

@Component({
  selector: "app-project-create",
  templateUrl: "createProject.component.html",
  styleUrls: ["createProject.component.css"]
})
export class CreateProjectComponent implements OnInit {
  public projectForm: FormGroup;
  public URL = `${configs.rootUrl}storages/proposals/upload`;
  public uploader: FileUploader = new FileUploader({ url: this.URL });
  public progress = 0;
  public isUploading = false;
  public isFileSelected = false;
  public error = false;
  public submitted = false;

  @Output() created = new EventEmitter();
  @Input() isEdit = false;
  @Input() project: any = {};

  constructor(
    public service: ProjectService,
    public router: Router,
    public sharedService: SharedService,
    public authService: AuthService
  ) {
    this.projectForm = new FormGroup({
      title: new FormControl("", Validators.required),
      description: new FormControl("", Validators.required)
    });
  }

  ngOnInit(): void {}

  createProject() {
    if (this.projectForm.valid) {
      if (this.isFileSelected) {
        this.isUploading = true;
        this.error = false;
        this.uploader.queue[this.uploader.queue.length - 1].upload();
        this.uploader.onSuccessItem = (
          item: FileItem,
          response: string,
          status: number,
          headers: ParsedResponseHeaders
        ) => {
          this.project.proposal = JSON.parse(response).result.files.file[0];
          this.project.createdAt = new Date();
          this.service.createProject(this.project).subscribe(
            res => {
              const userId = this.authService.getUserId();
              if (userId) {
                this.service
                  .addProjectMember({ projectId: res.id, userId: userId })
                  .subscribe(res1 => {
                    this.isUploading = false;
                    this.sharedService.addToast(
                      "Success",
                      "Project Created!",
                      "success"
                    );
                    this.created.emit();
                  });
              }
            },
            err => {
              if ((err.status = 422)) {
                this.sharedService.addToast("", "Error occurred!", "error");
                this.isUploading = false;
              }
            }
          );
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
          this.isUploading = false;
          this.uploader.queue.pop();
        };
        this.uploader.onErrorItem = (
          item: FileItem,
          response: string,
          status: number,
          headers: ParsedResponseHeaders
        ) => {
          this.error = true;
          this.isUploading = false;
          this.uploader.queue.pop();
        };
      }
    } else {
      this.markFormGroupTouched(this.projectForm);
    }
  }

  editProject() {
    if (this.projectForm.valid) {
      if (this.isFileSelected) {
        this.isUploading = true;
        this.uploader.queue[this.uploader.queue.length - 1].upload();
        this.uploader.onSuccessItem = (
          item: FileItem,
          response: string,
          status: number,
          headers: ParsedResponseHeaders
        ) => {
          this.project.proposal = JSON.parse(response).result.files.file[0];
          this.updateProject();
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
          this.isUploading = false;
          this.uploader.queue.pop();
        };
        this.uploader.onErrorItem = (
          item: FileItem,
          response: string,
          status: number,
          headers: ParsedResponseHeaders
        ) => {
          this.error = true;
          this.isUploading = false;
          this.uploader.queue.pop();
        };
      } else {
        this.updateProject();
      }
    } else {
      this.markFormGroupTouched(this.projectForm);
    }
  }

  onFormSubmit() {
    if (this.isEdit) {
      this.editProject();
    } else {
      this.submitted = true;
      this.createProject();
    }
  }

  private updateProject() {
    this.service.updateProject(this.project.id, this.project).subscribe(
      res => {
        this.sharedService.addToast(
          "Success",
          "Project updated successfully!",
          "success"
        );
        this.isUploading = false;
        this.created.emit();
      },
      error => {
        this.sharedService.addToast("", "Error occurred!", "error");
      }
    );
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

  reset() {
    this.submitted = false;
    if (!this.isEdit) {
      this.project = {};
      this.projectForm.reset();
    }
  }
}
