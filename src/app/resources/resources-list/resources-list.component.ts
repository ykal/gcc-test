import { Component, OnInit } from "@angular/core";
import { ResourcesService } from "../service/resources.service";
import { Resource } from "../models/resource";
import { Router } from "@angular/router";
import { configs } from "../../app.config";
import { AuthService } from "../../Auth/services/auth.service";
import { CommonService } from "../../shared/services/common.service";
import { SharedService } from "../../shared/services/shared.service";

@Component({
  selector: "app-resources-list",
  templateUrl: "./resources-list.component.html",
  styleUrls: ["./resources-list.component.css"]
})
export class ResourcesListComponent implements OnInit {
  public resources: Resource[] = [];
  public doc_resources: Resource[] = [];
  public vid_resources: Resource[] = [];
  public filterCategory = "";
  public keyword = "";
  public categories = [];
  public downloadLink = configs.rootUrl + "storages/resources/download/";
  public choosenResource: Resource = null;
  docResourcePage = 1;
  vidResourcePage = 1;
  p = 1;
  collections = [1, 2];
  public showDetail = false;
  public selectedResource: any = null;
  public backUpDocResources = [];
  public backUpVidResources = [];

  constructor(
    public resourceService: ResourcesService,
    public router: Router,
    public authService: AuthService,
    public service: CommonService,
    public sharedService: SharedService
  ) {}

  ngOnInit() {
    this.resourceService.getResources().subscribe(
      res => {
        this.resources = res;
        res.filter(item => {
          if (item.type === "document") {
            this.doc_resources.push(item);
            this.backUpDocResources.push(item);
          } else if (item.type === "video") {
            this.vid_resources.push(item);
            this.backUpVidResources.push(item);
          }
        });
      },
      err => {
        console.log("error while fetching resource", err);
      }
    );

    this.service.getCategories().subscribe(res => {
      this.categories = res;
    });
  }

  uploadResource() {
    this.router.navigate(["resources/upload"]);
  }

  filterResource($event) {
    this.keyword = "";
    if (this.filterCategory !== "") {
      this.vid_resources = this.backUpVidResources.filter(item => {
        return (
          item.category
            .toUpperCase()
            .indexOf(this.filterCategory.toUpperCase()) !== -1
        );
      });
      this.doc_resources = this.backUpDocResources.filter(item => {
        return (
          item.category
            .toUpperCase()
            .indexOf(this.filterCategory.toUpperCase()) !== -1
        );
      });
    } else {
      this.vid_resources = this.backUpVidResources;
      this.doc_resources = this.backUpDocResources;
    }
  }

  onSearch($event) {
    this.filterCategory = "";
    if (this.keyword !== "") {
      this.vid_resources = this.backUpVidResources.filter(item =>
        item.title.toUpperCase().includes(this.keyword.toUpperCase())
      );
      this.doc_resources = this.backUpDocResources.filter(item =>
        item.title.toUpperCase().includes(this.keyword.toUpperCase())
      );
    } else {
      this.vid_resources = this.backUpVidResources;
      this.doc_resources = this.backUpDocResources;
    }
  }

  downloadResource(content) {
    this.resourceService.downloadResource(content.name).subscribe(
      res => {
        const url = window.URL.createObjectURL(res.data);
        let a = document.createElement("a");
        document.body.appendChild(a);
        a.setAttribute("style", "display: none");
        a.href = url;
        a.download = res.fileName;
        a.click();
        window.URL.revokeObjectURL(url);
        a.remove(); // remove the element
      },
      error => {
        console.log("error", error);
      }
    );
  }

  onChoosingVideoResource(resource: Resource) {
    this.choosenResource = resource;
  }

  viewResourceDetail(resource) {
    this.showDetail = true;
    this.selectedResource = resource;
  }

  cancelResourceDetail() {
    this.showDetail = false;
    this.selectedResource = null;
  }

  getVideoThumbinal(url) {
    const videoId = this.getVideoId(url);
    return `http://img.youtube.com/vi/${videoId}/0.jpg`;
  }

  getVideoId(url) {
    let videoId = "";
    if (url.indexOf("?v") !== -1) {
      videoId = url.slice(url.indexOf("?v") + 3, url.length);
    } else if (url.indexOf("&v") !== -1) {
      videoId = url.slice(url.indexOf("&v") + 3, url.length);
    } else if (url.indexOf("youtu.be/") !== -1) {
      videoId = url.slice(
        url.indexOf("youtu.be/") + "youtu.be/".length,
        url.length
      );
    }
    return videoId;
  }

  getLimittedTitle(title, limit) {
    if (title.length > limit) {
      return title.slice(0, limit) + "...";
    } else {
      return title;
    }
  }

  onEditVideo($event) {
    if ($event.resource) {
      this.router.navigate(["resources/upload"], {
        queryParams: $event.resource
      });
    }
  }

  deleteResource(resource) {
    this.resourceService.deleteResource(resource.id).subscribe(
      res => {
        if (resource.type === "video") {
          this.vid_resources.splice(this.vid_resources.indexOf(resource), 1);
          this.choosenResource = null;
        } else {
          this.doc_resources.splice(this.doc_resources.indexOf(resource), 1);
          this.selectedResource = null;
          this.showDetail = false;
        }
        this.sharedService.addToast("Success", "Resource Deleted!", "success");
      },
      error => {
        console.log(error);
        this.sharedService.addToast("", "Error occured!", "error");
      }
    );
  }

  editResource(resource) {
    if (resource) {
      this.router.navigate(["resources/upload"], { queryParams: resource });
    }
  }
}
