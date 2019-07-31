import {Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {CompetitionService} from '../competition.service';
import {SharedService} from '../../shared/services/shared.service';

@Component({
  selector: 'app-edit-competition',
  templateUrl: './edit-competition.component.html',
  styleUrls: ['./edit-competition.component.css']
})

export class EditCompetitionComponent implements OnInit, OnChanges {

  public cities = [];
  public competitionForm: FormGroup;
  @Output()  updated = new EventEmitter();
  @Input() competition = {
    name: '',
    cities: [],
    startingDate: ''
  };
  @Input() isEdit = false;

  dropdownSettings = {
    singleSelection: false,
    idField: 'item_id',
    textField: 'item_text',
    selectAllText: 'Select All',
    unSelectAllText: 'UnSelect All',
    itemsShowLimit: 3,
    allowSearchFilter: true
  };

  constructor(public service: CompetitionService, public sharedService: SharedService) {
    this.competitionForm = new FormGroup({
      name: new FormControl('', Validators.required),
      startingDate: new FormControl('', Validators.required),
      cities: new FormControl('', Validators.required)
    });
  }
  ngOnInit(): void {
    this.service.getCities()
      .subscribe(res => {
        this.cities = res;
      });
  }


  ngOnChanges(changes: SimpleChanges): void {
    this.competition = changes.competition.currentValue;
  }

  updateCompetition() {
    if (this.competitionForm.valid) {
      this.service.updateCompetition(this.competition)
        .subscribe(res => {
          this.sharedService.addToast('Success', 'Competition updated successfully!', 'success');
          this.updated.emit();
        }, errorr => {
          this.sharedService.addToast('', 'Error occurred!', 'error');
        });
    } else {
      this.markFormGroupTouched(this.competitionForm);
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

  mapCitiesToDropDownList(cities) {
    let cityList = [];
    cities.forEach(item => {
      cityList.push({item_id: item.id, item_text: item.name});
    });

    return cityList;
  }

  populateSelectedCities(cities) {
    const selected = this.cities.filter(city => {
      return cities.indexOf(city.id) !== -1;
    });
    const selectedCities = this.mapCitiesToDropDownList(selected);
    return selectedCities;
  }

  onItemSelected(item) {
    if (this.competition.cities.indexOf(item.item_id) === -1) {
      this.competition.cities.push(item.item_id);
    }
  }

  onItemDeselected(item) {
    this.competition.cities.splice(this.competition.cities.indexOf(item.item_id), 1);
  }

  onSelectAll(items) {
    items.forEach(item => {
      this.onItemSelected(item);
    });
  }

  onDeselectAll(items) {
    this.competition.cities = [];
  }
}
