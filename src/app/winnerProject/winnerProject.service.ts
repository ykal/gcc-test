import { Injectable } from "@angular/core";
import { ApiService } from "../shared/services/api.service";

@Injectable()
export class WinnerProjectService {
  constructor(public apiService: ApiService) { }

  labelCompetitionWinner(winner) {
    return this.apiService.post(`competitionWinners/`, winner);
  }

  labelAlmuniProject(almuni) {
    return this.apiService.post(`almuniProjects/`, almuni);
  }

  labelWeeklyWinner(winner) {
    return this.apiService.post(`weekTopProjects/`, winner);
  }

  getWeeklyWinners() {
    return this.apiService.get(
      `weekTopProjects?filter={"include": "solveitproject"}`
    );
  }

  getCompetitionWinners() {
    return this.apiService.get(
      `competitionWinners?filter={"include": ["solveitproject", "competition", "cityModel"]}`
    );
  }

  getAlmuniProjects() {
    return this.apiService.get(
      `almuniProjects?filter={"include": ["solveitproject", "competition"]}`
    );
  }

  removeCompetitionWinnerLabel(winnerId) {
    return this.apiService.patch(`competitionWinners/${winnerId}`, {
      active: false
    });
  }

  removeAlmuniProjectLabel(almuniId) {
    return this.apiService.patch(`almuniProjects/${almuniId}`, {
      active: false
    });
  }

  removeWeeklyWinnerLabel(winnerId) {
    return this.apiService.patch(`weekTopProjects/${winnerId}`, {
      active: false
    });
  }
}
