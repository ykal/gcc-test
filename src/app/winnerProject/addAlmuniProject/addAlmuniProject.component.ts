import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { SharedService } from "../../shared/services/shared.service";
import { WinnerProjectService } from "../winnerProject.service";
import { CompetitionService } from "../../competition/competition.service";
import { AuthService } from "../../Auth/services/auth.service";

@Component({
  selector: "app-add-almuni-project",
  templateUrl: "addAlmuniProject.component.html",
  styleUrls: ["addAlmuniProject.component.css"]
})
export class AddAlmuniProjectComponent implements OnInit {
  public almuniProject = { active: true };
  public almuniProjectForm: FormGroup;
  public projects = [];
  public competitions = [];

  constructor(
    public service: WinnerProjectService,
    public fb: FormBuilder,
    public sharedService: SharedService,
    public competitionService: CompetitionService,
    public authService: AuthService
  ) {
    this.almuniProjectForm = this.fb.group({
      project: ["", Validators.required],
      competition: ["", Validators.required]
    });
  }

  ngOnInit() {
    this.getCompetition();
  }

  addAlmuniProject() {
    this.service.labelAlmuniProject(this.almuniProject).subscribe(
      res => {
        this.sharedService.addToast(
          "Success",
          "New Almuni Project Added!.",
          "success"
        );
      },
      err => {
        this.sharedService.addToast("Error", "Error occurred!", "error");
      }
    );
  }

  getCompetition() {
    this.competitionService.getActiveCompetition().subscribe(res => {
      this.competitions = res.Result;
      if (this.competitions.length != 0) {
        this.getProjects(this.competitions[0].id);
      }
    });
  }

  getProjects(competitionId) {
    this.competitionService.getProjects(competitionId).subscribe(res => {
      this.projects = res;
    });
  }
}
