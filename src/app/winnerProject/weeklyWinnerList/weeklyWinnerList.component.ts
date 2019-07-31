import { Component, OnInit } from "@angular/core";
import { WinnerProjectService } from "../winnerProject.service";
import { SharedService } from "../../shared/services/shared.service";

@Component({
  selector: "app-weekly-winner-list",
  templateUrl: "weeklyWinnerList.component.html",
  styleUrls: ["weeklyWinnerList.component.css"]
})
export class WeeklyWinnerListComponent implements OnInit {
  public weeklyWinners = [];
  public page: number = 1;

  constructor(
    public service: WinnerProjectService,
    public sharedService: SharedService
  ) { }

  ngOnInit() {
    this.getWeeklyinners();
  }

  getWeeklyinners() {
    this.service.getWeeklyWinners().subscribe(res => {
      this.weeklyWinners = res;
    });
  }

  removeWeeklyWinnerLabel(winner) {
    this.service.removeWeeklyWinnerLabel(winner.id).subscribe(
      res => {
        winner.active = false;
        this.sharedService.addToast(
          "Success",
          "Weekly Winner Removed!.",
          "success"
        );
      },
      err => {
        this.sharedService.addToast("Error", "Error occurred!", "error");
      }
    );
  }
}
