import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { CityService } from '../../dashboard/city/city.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { IMultiSelectOption, IMultiSelectSettings, IMultiSelectTexts } from 'angular-2-dropdown-multiselect';
import { UserManagementService } from '../userManagament.service';
import { SharedService } from '../../shared/services/shared.service';

@Component({
  selector: 'app-assign-region',
  templateUrl: './assign-region.component.html',
  styleUrls: ['./assign-region.component.css']
})
export class AssignRegionComponent implements OnInit, OnChanges {

  form: FormGroup;
  @Input() user = null;
  @Output() exit = new EventEmitter();
  isLoading = true;

  fetchedCities = [];
  selectedCities = [];
  assignedCities = [

  ];

  optionsModel: number[];
  cities: any[];

  mySettings: IMultiSelectSettings = {
    enableSearch: true,
    buttonClasses: 'btn btn-default btn-block',
    dynamicTitleMaxItems: 3,
    displayAllSelectedText: true
  };

// Text configuration
  myTexts: IMultiSelectTexts = {
    checkAll: 'Select all',
    uncheckAll: 'Unselect all',
    checked: 'item selected',
    checkedPlural: 'items selected',
    searchPlaceholder: 'Find',
    searchEmptyResult: 'Nothing found...',
    searchNoRenderText: 'Type in search box to see results...',
    defaultTitle: 'Select',
    allSelected: 'All selected',
  };

  constructor(private sharedService: SharedService, private cityService: CityService,
              private fb: FormBuilder, private userService: UserManagementService) { }

  ngOnInit() {
    this.cities = [];
    this.form = this.fb.group({
      cities: ['']
    });
    this.getCities();
  }

  onChange() {
    // console.log(this.optionsModel);
  }

  getCities () {
    this.cityService.getCities()
      .subscribe(res => {
        this.fetchedCities = res;
        this.fetchedCities.forEach(item => {
          this.cities = this.cities.concat({id: this.cities.length + 1 , name: item.name, cityId: item.id});
        });
      });
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.user = changes.user.currentValue;
    if (this.user) {
      this.optionsModel = [];
      this.isLoading = true;
      this.userService.getAssignedCities(this.user.id)
        .subscribe(res => {
          if (res.length > 0) {
            const cities = res[0].cities;
            cities.forEach(city => {
              this.cities.forEach(item => {
                if (item.cityId === city) {
                  if (this.optionsModel.indexOf(item.id) === -1) {
                    this.optionsModel = this.optionsModel.concat(item.id);
                  }
                }
              });
            });
          }
          this.isLoading = false;
        }, error => {
          this.isLoading = false;
        });
    }
  }

  done() {
    if (this.form.valid) {
      this.optionsModel.forEach(item => {
        this.cities.forEach(city => {
          if (item === city.id) {
            this.assignedCities.push(city.cityId);
          }
        });
      });
      this.userService.assignCities({userId: this.user.id, cities: this.assignedCities})
        .subscribe(res => {
          if (res.error) {
            this.sharedService.addToast('', 'Error occurred!', 'error');
            this.exit.emit();
          }
          this.sharedService.addToast('', 'Assigned Successfully!', 'success');
          this.exit.emit();
        }, error => {
          this.sharedService.addToast('', 'Error occurred!', 'error');
          this.exit.emit();
        });
    } else {
      this.markFormGroupTouched(this.form);
    }
  }

  /**
   * Marks all controls in a form group as touched
   * @param formGroup - The form group to touch
   */
  public markFormGroupTouched(formGroup: any) {
    (<any>Object).values(formGroup.controls).forEach(control => {
      control.markAsTouched();

      if (control.controls) {
        this.markFormGroupTouched(control);
      }
    });
  }

}
