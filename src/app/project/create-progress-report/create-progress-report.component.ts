import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { configs } from "../../app.config";
import { FileItem, FileUploader, ParsedResponseHeaders } from "ng2-file-upload";
import { ProjectService } from "../project.service";
import { SharedService } from "../../shared/services/shared.service";
import { AuthService } from "../../Auth/services/auth.service";

@Component({
  selector: "app-create-progress-report",
  templateUrl: "./create-progress-report.component.html",
  styleUrls: ["./create-progress-report.component.css"]
})
export class CreateProgressReportComponent implements OnInit {
  public reportForm: FormGroup;
  public report: any = {
    title: "",
    type: "",
    report: "",
    userId: ""
  };
  public URL = `${configs.rootUrl}storages/reports/upload`;
  public uploader: FileUploader = new FileUploader({ url: this.URL });
  public progress = 0;
  public isUploading = false;
  public isFileSelected = false;
  public error = false;
  public types = [
    { id: "attachment", name: "Attach Document" },
    { id: "simple", name: "Simple Report" }
  ];
  @Input() project: any = {};
  @Output() created = new EventEmitter();

  constructor(
    public formBuilder: FormBuilder,
    public service: ProjectService,
    public sharedService: SharedService,
    public authService: AuthService
  ) {}

  ngOnInit() {
    this.reportForm = this.formBuilder.group({
      title: ["", Validators.required],
      type: ["", Validators.required],
      report: ["", Validators.required]
    });
  }

  uploadProgressReport() {
    if (this.isFormValid()) {
      this.report.createdAt = new Date();
      this.report.projectId = this.project.id;
      const userId = this.authService.getUserId();
      this.report.userId = userId;
      if (this.report.type === this.types[0].id) {
        this.error = false;

        this.isUploading = true;
        this.uploader.queue[0].upload();
        this.uploader.onSuccessItem = (
          item: FileItem,
          response: string,
          status: number,
          headers: ParsedResponseHeaders
        ) => {
          this.report.content = JSON.parse(response).result.files.file[0];
          this.service.uploadProgressReport(this.report).subscribe(
            res => {
              this.sharedService.addToast(
                "Success",
                "Project Created!.",
                "success"
              );
              this.isUploading = false;
              this.created.emit();
            },
            err => {
              if ((err.status = 422)) {
                this.sharedService.addToast("", "Error occurred!", "error");
              }
            }
          );
          this.uploader.queue.pop();
        };
        this.uploader.onProgressItem = (fileItem: FileItem, progress: any) => {
          console.log("progress => ", progress);
          this.progress = progress;
        };
        this.uploader.onCancelItem = (
          item: FileItem,
          response: string,
          status: number,
          headers: ParsedResponseHeaders
        ) => {
          console.log("Canceled");
          this.isUploading = false;
          this.uploader.queue.pop();
        };
        this.uploader.onErrorItem = (
          item: FileItem,
          response: string,
          status: number,
          headers: ParsedResponseHeaders
        ) => {
          console.log("error");
          this.error = true;
          this.isUploading = false;
          this.uploader.queue.pop();
        };
      } else if (this.report.type === this.types[1].id) {
        this.service.uploadProgressReport(this.report).subscribe(
          res => {
            this.sharedService.addToast(
              "Success",
              "Project Created!.",
              "success"
            );
            this.isUploading = false;
            this.created.emit();
          },
          err => {
            if ((err.status = 422)) {
              this.sharedService.addToast("", "Error occurred!", "error");
            }
          }
        );
      }
    } else {
      this.sharedService.addToast("", "Error occurred!", "error");
    }
  }

  isFormValid() {
    if (this.report.title !== "" && this.report.type !== "") {
      if (this.report.type === this.types[0].id) {
        return this.isFileSelected;
      } else if (this.report.type === this.types[1].id) {
        return this.report.report !== "";
      }
      return false;
    }
    return false;
  }

  handleFileSelection($event) {
    this.isFileSelected = true;
  }
}
