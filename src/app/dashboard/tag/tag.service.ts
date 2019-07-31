import {Injectable} from '@angular/core';
import {ApiService} from '../../shared/services/api.service';

@Injectable()

export class TagService {

  public endpoint = 'tags';

  constructor(public apiService: ApiService) {

  }

  getTags() {
    return this.apiService.get(this.endpoint);
  }

  addTag(tag) {
    return this.apiService.post(this.endpoint, tag);
  }

  deleteTag(tag) {
    return this.apiService.delete(`${this.endpoint}/${tag.id}`);
  }


}
