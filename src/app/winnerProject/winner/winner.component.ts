import { Component } from "@angular/core";
import { AuthService } from "../../Auth/services/auth.service";

@Component({
  selector: "app-winner",
  templateUrl: "winner.component.html",
  styleUrls: ["winner.component.css"]
})
export class WinnerComponent {
  public selected = "winner-list-weekly";

  constructor(private authService: AuthService) {}

  toggleView(view) {
    this.selected = view;
  }
}
