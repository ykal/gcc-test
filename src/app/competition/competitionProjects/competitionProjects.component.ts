import { Component, Input, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { CompetitionService } from "../competition.service";
import { CityService } from "../../dashboard/city/city.service";
import { NgxSpinnerService } from "ngx-spinner";
import { AuthService } from "../../Auth/services/auth.service";
import { UserManagementService } from "../../userManagement/userManagament.service";
import { fromPromise } from "rxjs/observable/fromPromise";

@Component({
  selector: "app-competition-projects",
  templateUrl: "./competitionProjects.component.html",
  styleUrls: ["competitionProjects.component.css"]
})
export class CompetitionProjectsComponent implements OnInit {
  @Input() competition = null;
  competitionId = "";
  public isEdit = false;
  public projects = [];
  public backupProjects = [];
  public keyword = "";
  public page = 1;
  public cities = [];
  selectedCity = "";

  constructor(
    private spinner: NgxSpinnerService,
    public route: ActivatedRoute,
    public router: Router,
    public service: CompetitionService,
    public cityService: CityService,
    public authService: AuthService,
    public userService: UserManagementService
  ) {}

  ngOnInit() {
    this.getProjects();
    this.getCompetition();
    window.localStorage.setItem(
      "competitionId",
      this.route.snapshot.params["id"]
    );
    // this.getCities();
  }

  getCompetition() {
    this.service.getCompetition(this.route.snapshot.params["id"]).subscribe(
      res => {
        this.competition = res;
      },
      error => {
        this.router.navigate(["404"]);
      }
    );
  }

  getProjects() {
    this.competitionId = this.route.snapshot.params["id"];
    const user = this.authService.getUserSession();
    if (user.role === "solve-it-team") {
      this.spinner.show();
      this.userService.getAssignedCities(user.userId).subscribe(
        res => {
          const assignedCities =
            !res.error && res.length !== 0 ? res[0] : { cities: [] };
          const competitionProjects = this.service.getProjects(
            this.competitionId
          );
          const cities = this.cityService.getCities();
          fromPromise(Promise.all([competitionProjects, cities])).subscribe(
            responses => {
              responses[1].subscribe(citiesResponse => {
                this.cities = citiesResponse.filter(
                  city => assignedCities.cities.indexOf(city.id) !== -1
                );
                responses[0].subscribe(projects => {
                  let temp = [];
                  this.backupProjects = projects.filter(
                    project => project.solveitproject
                  );
                  this.backupProjects.forEach(project => {
                    this.cities.forEach(city => {
                      if (project.cities.indexOf(city.id) !== -1) {
                        temp.push(project);
                      }
                    });
                  });
                  this.backupProjects = temp;
                  this.projects = this.backupProjects;
                  this.spinner.hide();
                });
              });
            },
            error => {
              this.spinner.hide();
            }
          );
        },
        err => {
          this.spinner.hide();
        }
      );
    } else {
      this.spinner.show();
      this.getCities();
      this.service.getProjects(this.competitionId).subscribe(
        res => {
          this.backupProjects = res.filter(project => project.solveitproject);
          this.projects = this.backupProjects;
          this.spinner.hide();
        },
        error => {
          this.spinner.hide();
        }
      );
    }
  }

  getCities() {
    this.cityService.getCities().subscribe(
      res => {
        this.cities = res;
      },
      error => {
        console.log("Error while fetching cities");
      }
    );
  }

  viewProject(project) {
    // navigate to project detail
    this.router.navigate(["/my-projects/", project.id]);
  }

  searchProject($event) {
    if (this.keyword !== "") {
      this.projects = this.backupProjects.filter(item => {
        return item.solveitproject.title
          .toUpperCase()
          .includes(this.keyword.toUpperCase());
      });
    } else {
      this.projects = this.backupProjects;
    }
  }

  filterByCity() {
    if (this.selectedCity !== "") {
      this.projects = this.backupProjects.filter(project => {
        return project.cities.indexOf(this.selectedCity) !== -1;
      });
    } else {
      this.projects = this.backupProjects;
    }
  }
}
