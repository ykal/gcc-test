import {Injectable} from '@angular/core';
import {ApiService} from '../shared/services/api.service';

@Injectable()

export class NewsService {

  newsUrl = 'news';

  constructor(public apiService: ApiService) {

  }

  fetchAllNews() {
    return this.apiService.get(`${this.newsUrl}?filter={"order": "createdAt DESC", "include": "user"}`);
  }

  fetchNews(id) {
    return this.apiService.get(`${this.newsUrl}/${id}?filter={"include": "user"}`);
  }

  createNews(news) {
    return this.apiService.post(this.newsUrl, news);
  }

  deleteNews(id) {
    return this.apiService.delete(`${this.newsUrl}/${id}`);
  }

  updateNews(news) {
    return this.apiService.put(`${this.newsUrl}/${news.id}`, news);
  }

}
