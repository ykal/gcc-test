import { Component, OnInit, Input } from "@angular/core";

@Component({
  selector: "app-not-found",
  templateUrl: "./not-found.component.html",
  styleUrls: ["./not-found.component.css"]
})
export class NotFoundComponent implements OnInit {
  @Input() message = "Not found message";
  @Input() type = "fetch";
  constructor() {}

  ngOnInit() {}
}
