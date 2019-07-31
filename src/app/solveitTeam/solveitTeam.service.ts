import { Injectable } from "@angular/core";
import { ApiService } from "../shared/services/api.service";

@Injectable()
export class SolveitTeamService {
  constructor(private apiService: ApiService) {}

  createEvent(event) {
    return this.apiService.post(`events`, event);
  }

  getEventsList() {
    return this.apiService.get(`events?filter={"order": "startDate DESC"}`);
  }

  getEvent(eventId) {
    return this.apiService.get(`events/${eventId}`);
  }

  fetchNews() {}

  updateEvent(event) {
    return this.apiService.patch(`events/${event.id}`, event);
  }
}
