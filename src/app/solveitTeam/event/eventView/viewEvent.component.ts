import {
  Component,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges
} from "@angular/core";
import { SolveitTeamService } from "../../solveitTeam.service";

@Component({
  selector: "app-event-view",
  templateUrl: "./viewEvent.component.html",
  styleUrls: ["./viewEvent.component.css"]
})
export class EventViewComponent implements OnInit {
  @Input() event = null;

  constructor(private service: SolveitTeamService) {}

  ngOnInit() {}

  getEvent(eventId) {
    this.service.getEvent(eventId).subscribe(res => {
      this.event = {
        title: res.title,
        description: res.description,
        date:
          new Date(res.date).getDate() +
          " - " +
          new Date(res.date).getMonth() +
          " - " +
          new Date(res.date).getFullYear(),
        clock:
          new Date(res.date).getHours() +
          " - " +
          new Date(res.date).getMinutes()
      };
    });
  }
}
