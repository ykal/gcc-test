import { Component, OnInit } from "@angular/core";
import { ResourcesService } from "../service/resources.service";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { FileItem, FileUploader, ParsedResponseHeaders } from "ng2-file-upload";
import { Resource } from "../models/resource";
import { configs } from "../../app.config";
import { Router, ActivatedRoute } from "@angular/router";
import { SharedService } from "../../shared/services/shared.service";
import { CommonService } from "../../shared/services/common.service";

@Component({
  selector: "app-create-resource",
  templateUrl: "./create-resource.component.html",
  styleUrls: ["./create-resource.component.css"]
})
export class CreateResourceComponent implements OnInit {
  public URL = `${configs.rootUrl}storages/resources/upload`;
  public uploader: FileUploader = new FileUploader({ url: this.URL });
  public resourceForm: FormGroup;
  public progress = 0;
  public isUploading = false;
  public isFileSelected = false;
  public categories = [];
  public resource: Resource = {
    title: "",
    type: "",
    content: {},
    url: "",
    category: "",
    description: ""
  };

  constructor(
    public resourceService: ResourcesService,
    public router: Router,
    public sharedService: SharedService,
    public service: CommonService,
    public activatedRoute: ActivatedRoute
  ) {}

  ngOnInit() {
    this.resourceForm = new FormGroup({
      type: new FormControl("", Validators.required),
      url: new FormControl(""),
      title: new FormControl("", Validators.required),
      category: new FormControl("", Validators.required),
      description: new FormControl("", Validators.required)
    });

    this.service.getCategories().subscribe(res => {
      this.categories = res;
    });

    this.activatedRoute.queryParams.subscribe(params => {
      if (params && params["id"]) {
        this.resource["category"] = params["category"];
        this.resource["description"] = params["description"];
        this.resource["id"] = params["id"];
        this.resource["type"] = params["type"];
        this.resource["url"] = params["url"];
        this.resource["title"] = params["title"];
        this.isFileSelected = true;
      }
    });
  }

  isResourceFormValid() {
    if (this.resourceForm.valid) {
      if (this.resource.type == "video") {
        return this.resource.url !== "";
      } else if (this.resource.type == "document") {
        return this.isFileSelected;
      }
    }
    return false;
  }

  handleFileSelection($event) {
    this.isFileSelected = true;
  }

  onCreateResource() {
    if (this.isResourceFormValid()) {
      this.isUploading = true;
      if (this.resource.type !== "video") {
        if (!this.resource.id) {
          this.uploader.queue[this.uploader.queue.length - 1].upload();
          this.uploader.onSuccessItem = (
            item: FileItem,
            response: string,
            status: number,
            headers: ParsedResponseHeaders
          ) => {
            this.resource.content = JSON.parse(response).result.files.file[0];
            this.resource.createdAt = new Date();
            this.resourceService.createResource(this.resource).subscribe(
              res => {
                this.router.navigate(["resources"]);
                this.sharedService.addToast(
                  "Success",
                  "New Resource Added!",
                  "success"
                );
                this.isUploading = false;
              },
              err => {
                if ((err.status = 422)) {
                  this.sharedService.addToast("", "Error occured!", "error");
                  this.isUploading = false;
                }
              }
            );
            for (let i = 0; i < this.uploader.queue.length; i++) {
              this.uploader.queue.pop();
            }
          };
          this.uploader.onProgressItem = (
            fileItem: FileItem,
            progress: any
          ) => {
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
            for (let i = 0; i < this.uploader.queue.length; i++) {
              this.uploader.queue.pop();
            }
          };
          this.uploader.onErrorItem = (
            item: FileItem,
            response: string,
            status: number,
            headers: ParsedResponseHeaders
          ) => {
            console.log("error");
            this.isUploading = false;
            for (let i = 0; i < this.uploader.queue.length; i++) {
              this.uploader.queue.pop();
            }
          };
        } else {
          this.updateDocumentResource(this.resource);
        }
      } else {
        if (!this.resource.id) {
          this.resource.createdAt = new Date();
          this.resourceService.createResource(this.resource).subscribe(
            res => {
              this.router.navigate(["resources"]);
              this.sharedService.addToast(
                "Success",
                "New Resource Added!",
                "success"
              );
              this.isUploading = false;
            },
            err => {
              if ((err.status = 422)) {
                this.sharedService.addToast("", "Error occured!", "error");
                this.isUploading = false;
              }
            }
          );
        } else {
          this.updateVideoResource(this.resource);
        }
      }
    } else {
      this.markFormGroupTouched(this.resourceForm);
    }
  }

  updateVideoResource(resource) {
    this.resourceService.updateResource(resource.id, resource).subscribe(
      res => {
        this.router.navigate(["resources"]);
        this.sharedService.addToast(
          "Success",
          "Resource Updated Successfuly!",
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

  updateDocumentResource(resource: Resource) {
    // this.resourceService.updateResource(resource.id, resource)
    if (this.uploader.queue.length > 0) {
      this.uploader.queue[this.uploader.queue.length - 1].upload();
      this.uploader.onSuccessItem = (
        item: FileItem,
        response: string,
        status: number,
        headers: ParsedResponseHeaders
      ) => {
        this.resource.content = JSON.parse(response).result.files.file[0];
        this.resourceService
          .updateResource(this.resource.id, this.resource)
          .subscribe(
            res => {
              this.router.navigate(["resources"]);
              this.sharedService.addToast(
                "Success",
                "Resource Updated Successfuly!",
                "success"
              );
              this.isUploading = false;
            },
            err => {
              if ((err.status = 422)) {
                this.sharedService.addToast("", "Error occured!", "error");
                this.isUploading = false;
              }
            }
          );
        for (let i = 0; i < this.uploader.queue.length; i++) {
          this.uploader.queue.pop();
        }
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
        console.log("Canceled");
        this.isUploading = false;
        for (let i = 0; i < this.uploader.queue.length; i++) {
          this.uploader.queue.pop();
        }
      };
      this.uploader.onErrorItem = (
        item: FileItem,
        response: string,
        status: number,
        headers: ParsedResponseHeaders
      ) => {
        console.log("error");
        this.isUploading = false;
        for (let i = 0; i < this.uploader.queue.length; i++) {
          this.uploader.queue.pop();
        }
      };
    } else {
      this.resourceService
        .updateResource(this.resource.id, this.resource)
        .subscribe(
          res => {
            this.router.navigate(["resources"]);
            this.sharedService.addToast(
              "Success",
              "Resource Updated Successfuly!",
              "success"
            );
            this.isUploading = false;
          },
          err => {
            if ((err.status = 422)) {
              this.sharedService.addToast("", "Error occured!", "error");
              this.isUploading = false;
            }
          }
        );
    }
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
