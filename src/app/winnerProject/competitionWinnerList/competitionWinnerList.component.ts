import { Component, OnInit } from "@angular/core";
import { WinnerProjectService } from "../winnerProject.service";
import { SharedService } from "../../shared/services/shared.service";
import { configs } from "../../app.config";

@Component({
  selector: "app-competition-winner-list",
  templateUrl: "competitionWinnerList.component.html",
  styleUrls: ["competitionWinnerList.component.css"]
})
export class CompetitionWinnerListComponent implements OnInit {
  public competitionWinners = [];
  public page: number = 1;

  constructor(
    public service: WinnerProjectService,
    public sharedService: SharedService
  ) { }

  ngOnInit() {
    this.getCompetitionWinners();
  }

  getCompetitionWinners() {
    this.service.getCompetitionWinners().subscribe(res => {
      this.competitionWinners = res;
    });
  }

  removeCompetitionWinnerLabel(winner) {
    this.service.removeCompetitionWinnerLabel(winner.id).subscribe(
      res => {
        winner.active = false;
        this.sharedService.addToast(
          "Success",
          "Competition Winner Removed!.",
          "success"
        );
      },
      err => {
        this.sharedService.addToast("Error", "Error occurred!", "error");
      }
    );
  }

  getImageUrl(item) {
    return `${configs.rootUrl}storages/${item.container}/download/${item.name}`;
  }
}
