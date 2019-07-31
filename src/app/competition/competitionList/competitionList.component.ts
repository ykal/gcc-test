import {
  Component,
  Input,
  EventEmitter,
  Output,
  OnInit,
  OnChanges,
  SimpleChanges
} from "@angular/core";
import { Router, ActivatedRoute, ParamMap } from "@angular/router";
import { CompetitionService } from "../competition.service";
import { SharedService } from "../../shared/services/shared.service";
import { AuthService } from "../../Auth/services/auth.service";

declare var $: any;

@Component({
  selector: "app-competition-list",
  templateUrl: "./competitionList.component.html",
  styleUrls: ["competitionList.component.css"]
})
export class CompetitionListComponent implements OnInit, OnChanges {
  public key = "";
  @Input() competitions = [];
  @Input() backupCompetitions = [];
  @Output() edit = new EventEmitter();
  @Output() viewCompetition = new EventEmitter();
  user = null;

  constructor(
    public service: CompetitionService,
    public sharedService: SharedService,
    public route: ActivatedRoute,
    public router: Router,
    public authService: AuthService
  ) {}

  ngOnInit(): void {
    this.competitions = this.backupCompetitions;
    this.user = this.authService.getUserSession();
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.backupCompetitions = changes.backupCompetitions.currentValue;
    this.competitions = this.backupCompetitions;
  }

  activateCompetition(competition) {
    const updatedCompetition = competition;
    updatedCompetition.active = true;
    this.service.activateDeactivateCompetition(updatedCompetition).subscribe(
      res => {
        this.sharedService.addToast(
          "Success",
          "Competition Deactivated!.",
          "success"
        );
        competition.active = true;
      },
      err => {
        if ((err.status = 422)) {
          this.sharedService.addToast("", "Error occured!", "error");
        }
      }
    );
  }

  isAccessible() {
    if (this.user) {
      return this.user.role === "admin" || this.user.role === "solve-it-mgt";
    }
    return false;
  }

  deactivateCompetition(competition) {
    const updatedCompetition = competition;
    updatedCompetition.active = false;
    this.service.activateDeactivateCompetition(updatedCompetition).subscribe(
      res => {
        this.sharedService.addToast(
          "Success",
          "Competition Deactivated!.",
          "success"
        );
        competition.active = false;
      },
      err => {
        if ((err.status = 422)) {
          this.sharedService.addToast("", "Error occured!", "error");
        }
      }
    );
  }

  viewProjects(competition) {
    this.router.navigate(["/competition", competition.id]);
  }

  onSearch($event) {
    if (this.key !== "") {
      this.competitions = this.backupCompetitions.filter(item => {
        return (
          item.name
            .toLocaleLowerCase()
            .indexOf(this.key.toLocaleLowerCase()) !== -1
        );
      });
    } else {
      this.competitions = this.backupCompetitions;
    }
  }

  onViewDetail(competition) {
    this.router.navigate([`dashboard/competitions/${competition.id}`]);
  }

  onEdit(competition) {
    this.edit.emit({ competition: competition });
  }
}
