import { Component, EventEmitter, OnInit, Output } from "@angular/core";
import { SolveitTeamService } from "../../solveitTeam.service";
import { AuthService } from "../../../Auth/services/auth.service";
import { NgxSpinnerService } from "ngx-spinner";

@Component({
  selector: "app-event-list",
  templateUrl: "./eventList.component.html",
  styleUrls: ["./eventList.component.css"]
})
export class EventListComponent implements OnInit {
  public events = [];
  public store = [];
  public selected = "events-list";
  public searchKey = "";
  public p = 1;
  public selectedEvent = null;
  @Output() edit = new EventEmitter();

  constructor(
    public service: SolveitTeamService,
    public authService: AuthService,
    private spinner: NgxSpinnerService
  ) {}

  ngOnInit() {
    this.getEventsList();
  }

  limitVenue(place, venue) {
    venue = place + ", " + venue;
    if (venue.trim().length > 45) {
      return venue.trim().slice(0, 45) + "...";
    } else {
      return venue.trim();
    }
  }

  filterByCity(city) {
    if (city !== "") {
      if (
        city.toLowerCase() === "asa'iyta" ||
        city.toLowerCase() === "dubti" ||
        city.toLowerCase() === "logia"
      ) {
        city = "semera";
      } else if (city.toLowerCase() === "adwa") {
        city = "aksum";
      }
      this.events = this.store.filter(event => {
        return event.city.toLowerCase() === city.toLowerCase();
      });
    } else {
      this.events = this.store;
    }
  }

  isOngoing(event) {
    const now = new Date();
    return (
      event.startDate <= now.toISOString() && now.toISOString() < event.endDate
    );
  }

  isPassed(event) {
    const now = new Date();
    return event.endDate < now.toISOString();
  }

  getEventsList() {
    this.spinner.show();
    this.service.getEventsList().subscribe(
      res => {
        this.events = res;
        this.store = this.events;
        this.spinner.hide();
      },
      error => {
        this.spinner.hide();
      }
    );
  }

  viewEvent() {
    this.selected = "view-event";
  }

  onSearch($event) {
    this.events = this.events.filter(event => {
      return event.title.indexOf(this.searchKey) !== -1;
    });
  }

  viewEventDetail(event) {
    this.selectedEvent = event;
  }

  getDate(date) {
    return {
      date:
        new Date(date).getDate() +
        " - " +
        new Date(date).getMonth() +
        " - " +
        new Date(date).getFullYear(),
      clock: new Date(date).getHours() + " : " + new Date(date).getMinutes()
    };
  }

  getLimmitedEventTitle(title, limmit) {
    if (title.length > limmit) {
      return title.slice(0, limmit) + "...";
    } else {
      return title;
    }
  }

  onEdit(event) {
    this.edit.emit({ event: event });
  }
}
