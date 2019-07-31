import { Injectable } from '@angular/core';
import { ApiService } from './api.service';

@Injectable()
export class CommonService {
  public endpoint = 'cities';
  newsUrl = 'news';

  constructor(public apiService: ApiService) {

  }

  // Cities common services
  getCities() {
    return this.apiService.get(this.endpoint + `?filter={"include": "region"}`);
  }

  getRegions() {
    return this.apiService.get(`Regions/`);
  }
  // News common services
  fetchAllNews() {
    return this.apiService.get(`${this.newsUrl}?filter={"order": "createdAt DESC", "include": "user"}`);
  }

  // Forum common services
  getCategories() {
    return this.apiService.get(`forumCategories`);
  }

  removeFromBlackList(discussionId) {
    return this.apiService.post(
      'BlackListedDiscussions/removeFromBlackList',
      discussionId
    );
  }

  getBlacklistedDiscussions() {
    return this.apiService.get(
      `BlackListedDiscussions?filter={"include": "Solveitdiscussion"}`
    );
  }

  removeDiscussion(discussionId) {
    return this.apiService.delete(`Solveitdiscussions/${discussionId}`);
  }

  searchUser(keyword, userId) {
    return this.apiService.get(`UserAccounts/search/${keyword}/${userId}`);
  }

  getWeeklyWinners() {
    return this.apiService.get(
      `weekTopProjects?filter={"where": {"active": true}, "include": "solveitproject"}`
    );
  }

  getCompetitions() {
    return this.apiService.get(`solvieITCompetitions/`);
  }

  getAllRegions() {
    return this.apiService.get(`Regions/`);
  }

  getAllCities() {
    return this.apiService.get(`cities/`);
  }

  getActiveCompetition() {
    return this.apiService.get(`solvieITCompetitions/active`);
  }

  getProjects(competitionId) {
    return this.apiService.post(
      `solvieITCompetitions/competition-projects`,
      { competitionId }
    );
  }

  toCammelCase(text: string) {
    const words = text.trim().split(' ');
    for (let i = 0; i < words.length; i++) {
      words[i] = words[i][0].toUpperCase() + words[i].slice(1).toLowerCase();
    }
    return words.join(' ');
  }
}
