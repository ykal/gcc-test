import { Component, OnInit } from '@angular/core';
import {CityService} from '../city.service';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {AuthService} from '../../../Auth/services/auth.service';
import {SharedService} from '../../../shared/services/shared.service';

@Component({
  selector: 'app-city-list',
  templateUrl: './cityList.component.html',
  styleUrls: ['./cityList.component.css']
})
export class CityListComponent implements OnInit {

  public cities = [];
  public backUpcities = [];
  public key = '';
  public cityForm: FormGroup;
  public city = {name: '', regionId: 0};
  public page = 1;
  public regions = [];

  constructor(public service: CityService, public fb: FormBuilder, public authService: AuthService, public sharedService: SharedService) {
  }

  ngOnInit() {
    this.getRegions();
    this.getCities();
    this.cityForm = this.fb.group({
      name: ['', Validators.required],
      region: ['', Validators.required]
    });
  }

  onSearch($event) {
    if (this.key !== '' && this.backUpcities.length > 0) {
      this.cities = this.backUpcities.filter(item => item.name.toUpperCase().indexOf(this.key.toUpperCase()) !== -1);
  } else if (this.key === '') {
      this.cities = this.backUpcities;
    }
}

  oncreateCity() {
    this.service.addCity(this.city)
      .subscribe(res => {
        this.sharedService.addToast('Success', 'New City Added!.', 'success');
        res.region = this.regions.filter((item) => {return item.id == this.city.regionId})[0];
        this.cityForm.reset();
        this.cities.push(res);
      }, err => {
        this.sharedService.addToast('Error', 'Error occurred!', 'error');
      });
  }

  getCities() {
    this.service.getCities()
      .subscribe(res => {
        this.cities = res;
        this.backUpcities = this.cities;
      });
  }

  deleteCity(city) {
    this.service.deleteCity(city)
      .subscribe(res => {
        this.cities.splice(this.cities.indexOf(city), 1);
        this.sharedService.addToast('Success', 'Deleted City Successfully!.', 'success');
      }, err => {
        this.sharedService.addToast('Error', 'Error occurred!.', 'error');
      });
  }

  getRegions() {
      this.service.getRegions().subscribe(
          res => {
              this.regions = res;
          }
      )
  }

}
