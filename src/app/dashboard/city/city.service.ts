import {Injectable} from '@angular/core';
import {ApiService} from '../../shared/services/api.service';

@Injectable()

export class CityService {

  public endpoint = 'cities';

  constructor(public apiService: ApiService) {

  }

  getCities() {
    return this.apiService.get(this.endpoint+`?filter={"include": "region"}`);
  }

  addCity(city) {
    return this.apiService.post(this.endpoint, city);
  }

  deleteCity(city) {
    return this.apiService.delete(`${this.endpoint}/${city.id}`);
  }

  getRegions() {
    return this.apiService.get(`Regions/`);
  }
}
