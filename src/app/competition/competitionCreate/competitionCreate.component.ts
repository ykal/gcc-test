import { Component, EventEmitter, Input, Output } from "@angular/core";
import { CompetitionService } from "../competition.service";
import { FormGroup, FormControl, Validators } from "@angular/forms";
import { SharedService } from "../../shared/services/shared.service";

@Component({
  selector: "app-competition-create",
  templateUrl: "competitionCreate.component.html",
  styleUrls: ["competitionCreate.component.css"]
})
export class CompetitionCreateComponent {
  public competitionForm: FormGroup;
  public cities = [];
  @Output() created = new EventEmitter();
  @Input() competition = {
    name: "",
    cities: [],
    startingDate: ""
  };
  @Input() isEdit = false;

  dropdownSettings = {
    singleSelection: false,
    idField: "item_id",
    textField: "item_text",
    selectAllText: "Select All",
    unSelectAllText: "UnSelect All",
    itemsShowLimit: 3,
    allowSearchFilter: true
  };

  constructor(
    public service: CompetitionService,
    public sharedService: SharedService
  ) {
    this.competitionForm = new FormGroup({
      name: new FormControl("", Validators.required),
      startingDate: new FormControl("", Validators.required),
      cities: new FormControl("", Validators.required)
    });

    this.service.getCities().subscribe(res => {
      this.cities = res;
    });
  }

  createCompetition() {
    if (this.competitionForm.valid) {
      this.service.createCompetition(this.competition).subscribe(
        res => {
          this.sharedService.addToast(
            "Success",
            "Competition created!",
            "success"
          );
          this.created.emit();
          this.reset();
        },
        err => {
          if ((err.status = 422)) {
            this.sharedService.addToast("", "Error occurred!", "error");
          }
        }
      );
    } else {
      this.markFormGroupTouched(this.competitionForm);
    }
  }

  mapCitiesToDropDownList(cities) {
    let cityList = [];
    this.cities.forEach(item => {
      cityList.push({ item_id: item.id, item_text: item.name });
    });

    return cityList;
  }

  onItemSelected(item) {
    if (this.competition.cities.indexOf(item.item_id) === -1) {
      this.competition.cities.push(item.item_id);
    }
  }

  onItemDeselected(item) {
    this.competition.cities.splice(
      this.competition.cities.indexOf(item.item_id),
      1
    );
  }

  onSelectAll(items) {
    items.forEach(item => {
      this.onItemSelected(item);
    });
  }

  onDeselectAll(items) {
    this.competition.cities = [];
  }

  onFormSubmit() {
    if (this.isEdit) {
      this.updateCompetition();
    } else {
      this.createCompetition();
    }
  }

  updateCompetition() {
    if (this.competitionForm.valid) {
      this.service.updateCompetition(this.competition).subscribe(
        res => {
          this.sharedService.addToast(
            "Success",
            "Competition updated successfully!",
            "success"
          );
          this.created.emit();
          this.reset();
        },
        errorr => {
          this.sharedService.addToast("", "Error occurred!", "error");
        }
      );
    } else {
      this.markFormGroupTouched(this.competitionForm);
    }
  }

  reset() {
    if (!this.isEdit) {
      this.competitionForm.reset();
    }
  }

  /**
   * Marks all controls in a form group as touched
   * @param formGroup - The form group to touch
   */
  private markFormGroupTouched(formGroup: any) {
    (<any>Object).values(formGroup.controls).forEach(control => {
      control.markAsTouched();

      if (control.controls) {
        this.markFormGroupTouched(control);
      }
    });
  }
}
