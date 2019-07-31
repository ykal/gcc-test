import { Component, OnInit } from "@angular/core";
import { WinnerProjectService } from "../winnerProject.service";
import { SharedService } from "../../shared/services/shared.service";

@Component({
  selector: "app-almuni-project-list",
  templateUrl: "almuniProjectList.component.html",
  styleUrls: ["almuniProjectList.component.css"]
})
export class AlmuniProjectListComponent implements OnInit {
  public almuniProjects = [];
  public page: number = 1;

  constructor(
    public service: WinnerProjectService,
    public sharedService: SharedService
  ) {}

  ngOnInit() {
    this.getAlmuniProjects();
  }

  getAlmuniProjects() {
    this.service.getAlmuniProjects().subscribe(res => {
      this.almuniProjects = res;
    });
  }

  removeAlmuniProjectLabel(almuni) {
    this.service.removeAlmuniProjectLabel(almuni.id).subscribe(
      res => {
        almuni.active = false;
        this.sharedService.addToast(
          "Success",
          "Almuni Project Removed!.",
          "success"
        );
      },
      err => {
        this.sharedService.addToast("Error", "Error occurred!", "error");
      }
    );
  }
}
