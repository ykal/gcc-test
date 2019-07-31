import { Component, OnInit } from "@angular/core";
import { Router, ActivatedRoute, ParamMap } from "@angular/router";
import { ProjectService } from "../project.service";
import { ApiService } from "../../shared/services/api.service";
import { AuthService } from "../../Auth/services/auth.service";
import { CommonService } from "../../shared/services/common.service";

declare var $: any;

@Component({
  selector: "app-project-view",
  templateUrl: "projectView.component.html",
  styleUrls: ["projectView.component.css"]
})
export class ProjectViewComponent implements OnInit {
  public views = ["report", "members", "add-member"];
  public selected = this.views[0];
  public uploadReport = false;
  public project: any = null;
  public progressReports: any = [];
  public selectedProgressReport = null;
  public isEnrolled = false;
  public count = 0;
  public members = [];

  // for joining cometition
  public activeCompetitions = [];
  public isJoinCompetitionSuccessfull = null;

  constructor(
    public route: ActivatedRoute,
    public router: Router,
    public service: ProjectService,
    public competitionService: CommonService,
    public apiService: ApiService,
    public authService: AuthService
  ) {}

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get("id");
    this.getProject(id);
    this.competitionService.getCompetitions().subscribe(
      res => {
        this.activeCompetitions = res;
        this.activeCompetitions = this.activeCompetitions.filter(item => {
          return item.active;
        });
      },
      error => {}
    );
    this.service.getMembers(id).subscribe(res => {
      res.forEach(item => {
        this.members.push(item.id);
      });
    });
  }

  toggleView(view) {
    this.selected = view;
  }

  getProject(projectId) {
    this.service.getProject(projectId).subscribe(
      res => {
        this.project = res;
        this.getProgressReports();
        this.isProjectRegisteredToCompetition();
      },
      error1 => {
        this.router.navigate(["/404"]);
      }
    );
  }

  public getProgressReports() {
    this.service.getAllProgressReport(this.project.id).subscribe(res1 => {
      this.progressReports = res1;
    });
  }

  addProjectMember() {
    const member = {
      projectId: this.project.id,
      userId: 0
    };
    this.service.addProjectMember(member).subscribe(res => {});
  }

  toggleUploadReport(value) {
    this.uploadReport = value;
  }

  downloadProposal(content) {
    this.service.downloadProposal(content).subscribe(
      res => {
        const url = window.URL.createObjectURL(res.data);
        const a = document.createElement("a");
        document.body.appendChild(a);
        a.setAttribute("style", "display: none");
        a.href = url;
        a.download = res.fileName;
        a.click();
        window.URL.revokeObjectURL(url);
        a.remove(); // remove the element
      },
      error => {}
    );
  }

  reportCreated() {
    this.uploadReport = false;
    this.getProgressReports();
  }

  onJoinCompetition($event) {
    this.service.joinCompetition(this.project, $event.data).subscribe(
      res => {
        this.isJoinCompetitionSuccessfull = true;
      },
      error => {
        this.isJoinCompetitionSuccessfull = false;
      }
    );
  }

  viewProgressReport(report) {
    this.selectedProgressReport = report;
  }

  back() {
    this.selectedProgressReport = null;
  }

  backToCompetitionProjects() {
    let temp = window.localStorage.getItem("competitionId");
    this.router.navigate([`dashboard/competitions/${temp}`]);
  }

  isProjectRegisteredToCompetition() {
    this.service.getProjectCompetitions(this.project.id).subscribe(res => {
      if (res.length == 0) {
        this.isEnrolled = false;
      } else {
        this.isEnrolled = true;
      }
      if (!this.isEnrolled && this.count === 0) {
        $("#myModal").modal("show");
        this.count += 1;
      }
    });
  }

  onProjectUpdated() {
    $("#createProjectModal").modal("hide");
  }

  limitProjectProposalTitle(title, limit) {
    if (title.length > limit) {
      return title.slice(0, limit) + "...";
    } else {
      return title;
    }
  }

  isMember(id) {
    if (id !== false) {
      return this.members.indexOf(id) !== -1;
    } else {
      return false;
    }
  }
}
