import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChange, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserManagementService } from '../userManagament.service';
import { SharedService } from '../../shared/services/shared.service';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-edit-profile',
  templateUrl: './edit-profile.component.html',
  styleUrls: ['./edit-profile.component.css']
})
export class EditProfileComponent implements OnInit, OnChanges {

  formGroup: FormGroup;
  @Output() updated = new EventEmitter();
  @Input() user = null;
  otherUser = null;
  cities = [];
  citiesBackup = [];
  regions = [];
  regionId = '';

  constructor(private spinner: NgxSpinnerService, private fb: FormBuilder,
              private service: UserManagementService, public sharedService: SharedService) { }

  ngOnInit() {
    this.formGroup = this.fb.group({
      firstName: ['', Validators.required],
      middleName: ['', Validators.required],
      lastName: ['', Validators.required],
      username: ['', Validators.required],
      phoneNumber: ['', Validators.required],
      sex: ['', Validators.required],
      age: ['', Validators.required],
      region: ['', Validators.required],
      city: ['', Validators.required]
    });

    const regionsPromise = this.service.getRegions();
    const citiesPromise = this.service.getCities();
    this.spinner.show();
    Promise.all([regionsPromise, citiesPromise])
      .then(res => {
        res[0].subscribe(res1 => {
          this.regions = res1;
        });
        res[1].subscribe(res2 => {
          this.cities = res2;
          this.citiesBackup = res2;
          if (this.user) {
            this.onCityChange();
            this.onRegionChange();
          }
        });
        this.spinner.hide();
      }, error => {
        this.spinner.hide();
      });

  }

  onCityChange() {
      const city = this.getRegionFromCity(this.user.cityId);
      this.regionId = city.regionId;
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

  ngOnChanges(changes: SimpleChanges): void {
    this.user = changes.user.currentValue;
    this.otherUser = changes.user.currentValue;
  }

  onRegionChange() {
    if (this.regionId !== '') {
      this.cities = this.citiesBackup.filter(item => {
        return item.regionId === this.regionId;
      });
    } else {
      this.cities = this.citiesBackup;
    }
  }

  onUpdate() {
    if (this.formGroup.valid) {
      this.spinner.show();
      this.service.updateProfile(this.user)
        .subscribe(res => {
          this.updated.emit();
          this.sharedService.addToast('Success', 'Profile Edited!.', 'success');
          this.spinner.hide();
        }, error => {
          this.sharedService.addToast('Error', 'Something Went Wrong!.', 'error');
          this.spinner.hide();
        });
    } else {
      this.markFormGroupTouched(this.formGroup);
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
