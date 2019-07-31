import { Component, Input, OnInit, Output, EventEmitter } from "@angular/core";
import { Resource } from "../models/resource";
import { DomSanitizer } from "@angular/platform-browser";
import { ResourcesService } from "../service/resources.service";
import { resource } from "selenium-webdriver/http";
import { AuthService } from "../../Auth/services/auth.service";

declare var $: any;

@Component({
  selector: "app-modal",
  templateUrl: "./modal.component.html",
  styleUrls: ["./modal.component.css"]
})
export class ModalComponent implements OnInit {
  @Input() resource: Resource;
  @Output() delete = new EventEmitter();
  @Output() edit = new EventEmitter();
  public isClose = false;

  constructor(
    public sanitizer: DomSanitizer,
    public service: ResourcesService,
    public authService: AuthService
  ) {}

  ngOnInit() {
    this.isClose = false;
  }

  getUrl() {
    if (this.resource) {
      if (!this.isClose) {
        const tempUrl =
          this.getVideoId(this.resource.url) +
          "?control=1&origin=https://icog-solveit.com";
        return tempUrl;
      } else {
        this.isClose = false;
        return "";
      }
    }
    return "";
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

  deleteResource() {
    this.delete.emit();
    $("#confirmation").modal("hide");
    $("#myModal").modal("hide");
  }

  onEdit(resource) {
    this.resetResource();
    $("#myModal").modal("hide");
    this.edit.emit({ resource });
  }

  resetResource() {
    this.isClose = true;
  }

  confirm() {
    $("#confirmation").modal("show");
  }

  cancel() {
    $("#confirmation").modal("hide");
  }
}
