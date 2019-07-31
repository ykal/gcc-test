import {Injectable} from '@angular/core';
import {ApiService} from '../../shared/services/api.service';

@Injectable()

export class CategoryService {

  public endpoint = 'forumCategories';

  constructor(public apiService: ApiService) {

  }

  getCategories() {
    return this.apiService.get(this.endpoint);
  }

  addCategory(category) {
    return this.apiService.post(this.endpoint, category);
  }

  deleteCategory(category) {
    return this.apiService.delete(`${this.endpoint}/${category.id}`);
  }


}
