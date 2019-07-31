import {Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {PhoneNumberValidation} from '../validator/phoneNumberValidation';
import { CommonService } from '../../shared/services/common.service';


@Component({
  selector: 'app-adress',
  templateUrl: './adress.component.html',
  styleUrls: ['./adress.component.css']
})
export class AdressComponent implements OnInit, OnChanges {

  @Output() next = new EventEmitter();
  @Output() back = new EventEmitter();

  public addressForm: FormGroup;
  public regions = [];
  public cities = [];
  public citiesBackup = [];
  public blockedRegions = [];
  public blockedCities = [];
  @Input() address;
  @Input() isLoading = false;

  constructor(public formBuilder: FormBuilder, public userService: CommonService) { }

  ngOnInit() {

    this.userService.getAllRegions()
      .subscribe(res => {
        this.regions = res;
      });

    this.userService.getAllCities()
      .subscribe(res => {

        const filtteredCities = res.filter(item => {
          return this.blockedCities.indexOf(item.name.toLowerCase()) == -1;
        });

        this.cities = filtteredCities;
        this.citiesBackup = filtteredCities;
      });

    this.addressForm = this.formBuilder.group({
      region: ['', Validators.required],
      city: ['', Validators.required],
      wereda: ['', Validators.required],
      houseNo: ['', Validators.required],
      fullName: ['', Validators.required],
      phoneNumber: ['', Validators.required]
    }, {
      validator: Validators.compose([PhoneNumberValidation.Validate])
    });
  }

  onRegionChange() {
    if (this.address.regionId !== '') {
      this.cities = this.citiesBackup.filter(item => {
        return item.regionId === this.address.regionId;
      });
    } else {
      this.cities = this.citiesBackup;
    }
  }

  getRegionFromCity(cityId): any {
    let city = null;
    this.citiesBackup.forEach(item => {
      if (item.id === cityId) {
        city = item;
      }
    });
    return city;
  }

  onCityChange() {
    if (this.address.regionId === '') {
      const city = this.getRegionFromCity(this.address.cityId);
      this.address.regionId = city.regionId;
    }
  }

  onDone() {
    if (this.addressForm.valid) {
      this.next.emit();
    } else {
      this.markFormGroupTouched(this.addressForm);
    }
  }

  onBack() {
    this.back.emit();
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

  ngOnChanges(changes: SimpleChanges): void {
    this.isLoading = changes.isLoading.currentValue;
  }


}
