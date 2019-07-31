import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { WinnerProjectService } from "../winnerProject.service";
import { SharedService } from "../../shared/services/shared.service";
import { AuthService } from "../../Auth/services/auth.service";
import { CommonService } from "../../shared/services/common.service";

@Component({
  selector: "app-add-weekly-winner",
  templateUrl: "addWeeklyWinner.component.html",
  styleUrls: ["addWeeklyWinner.component.css"]
})
export class AddWeeklyWinnerComponent implements OnInit {
  public weeklyWinner = {
    active: true,
    city: "All",
    week: "",
    rank: "",
    competition: "",
    project: "",
    competitionId: "",
    projectId: ""
  };
  public weeklyWinnerForm: FormGroup;
  public projects = [];
  public projectsBackup = [];
  public competitions = [];
  public cities = [];

  constructor(
    public service: WinnerProjectService,
    public fb: FormBuilder,
    public sharedService: SharedService,
    public competitionService: CommonService,
    public authService: AuthService
  ) {
    this.weeklyWinnerForm = this.fb.group({
      week: ["", Validators.required],
      city: ["", Validators.required],
      rank: ["", Validators.required],
      competition: ["", Validators.required],
      project: ["", Validators.required]
    });
  }

  ngOnInit() {
    // this.getCompetition();
    this.fetchParams();
  }

  resetForm() {
    this.weeklyWinner = {
      active: true,
      week: "",
      city: "All",
      rank: "",
      competition: "",
      project: "",
      competitionId: "",
      projectId: ""
    };
    this.weeklyWinnerForm.reset();
  }

  addWeeklyWinner() {
    if (this.weeklyWinnerForm.valid) {
      this.service.labelWeeklyWinner(this.weeklyWinner).subscribe(
        res => {
          this.sharedService.addToast(
            "Success",
            "New Weekly Winner Added!",
            "success"
          );
          this.resetForm();
        },
        err => {
          this.sharedService.addToast("Error", "Error occurred!", "error");
        }
      );
    } else {
      this.markFormGroupTouched(this.weeklyWinnerForm);
    }
  }

  getCompetition() {
    this.competitionService.getActiveCompetition().subscribe(res => {
      this.competitions = res.Result;
      if (this.competitions.length != 0) {
        this.getProjects(this.competitions[0].id);
      }
    });
  }

  fetchParams() {
    console.log('inside active competition');
    const cities = this.competitionService.getCities();
    const activeCompetition = this.competitionService.getActiveCompetition();
    Promise.all([activeCompetition, cities])
      .then((res) => {
        console.log(res);
        res[0].subscribe(competitions => {
          this.competitions = competitions.Result;
          if (this.competitions.length !== 0) {
            this.getProjects(this.competitions[0].id);
          }
        });
        res[1].subscribe(cities => {
          this.cities = cities;
        });
      });
  }

  getProjects(competitionId) {
    this.competitionService.getProjects(competitionId).subscribe(res => {
      this.projectsBackup = res.filter(project => project.solveitproject);
      this.projects = this.projectsBackup;
    });
  }

  filterProjectByCity() {
    console.log(this.weeklyWinner.city);
    if (this.weeklyWinner.city === 'All') {
      this.projects = this.projectsBackup;
    } else {
      this.projects = this.projectsBackup.filter(project => project.cities[0] === this.weeklyWinner.city);
    }
  }

  /**
   * Marks all controls in a form group as touched
   * @param formGroup - The form group to touch
   */
  public markFormGroupTouched(formGroup: any) {
    (<any>Object).values(formGroup.controls).forEach(control => {
      control.markAsTouched();
      if (control.controls) {
        this.markFormGroupTouched(control);
      }
    });
  }
}
