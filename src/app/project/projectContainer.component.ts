import { Component, OnInit } from "@angular/core";
import { ProjectService } from "./project.service";
import { SharedService } from "../shared/services/shared.service";
import { AuthService } from "../Auth/services/auth.service";
declare var $: any;

@Component({
  selector: "app-project-container",
  templateUrl: "projectContainer.component.html",
  styleUrls: ["projectContainer.component.css"]
})
export class ProjectContainerComponent implements OnInit {
  public projects = [];
  public selected = "project-list";

  constructor(
    public service: ProjectService,
    public sharedService: SharedService,
    public authService: AuthService
  ) {}

  ngOnInit() {
    this.getProjectList();
  }

  getProjectList() {
    const userId = this.authService.getUserId();
    if (userId) {
      this.service.getMyProjects(userId).subscribe(
        res => {
          res.forEach(item => {
            this.isProjectRegisteredToCompetition(item, isEnrolled => {
              this.projects.push({ ...item, isEnrolled: isEnrolled });
            });
          });
        },
        error => {
          this.sharedService.addToast("", "Error occurred!", "error");
        }
      );
    } else {
      console.log("You are not signed in yet.");
    }
  }

  toggleView(view) {
    this.selected = view;
  }

  projectCreated() {
    this.getProjectList();
    $("#createProjectModal").modal("hide");
  }

  isProjectRegisteredToCompetition(project, execute) {
    let isEnrolled = false;
    this.service.getProjectCompetitions(project.id).subscribe(res => {
      if (res.length === 0) {
        isEnrolled = false;
      } else {
        isEnrolled = true;
      }
      execute(isEnrolled);
    });
  }
}
