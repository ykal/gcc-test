import { Component, OnInit } from '@angular/core';
import {NewsService} from '../news.service';
import {Router} from '@angular/router';
import {configs} from '../../app.config';
import {AuthService} from '../../Auth/services/auth.service';

@Component({
  selector: 'app-news-list',
  templateUrl: './news-list.component.html',
  styleUrls: ['./news-list.component.css']
})
export class NewsListComponent implements OnInit {

  public news = [];
  public newsBackup = [];
  public recentNews = [];
  public isCreateNewsActive = false;
  public keyword = '';
  public page = 1;

  constructor(public service: NewsService, public router: Router, public authService: AuthService) { }

  ngOnInit() {
    this.fetchAllNews();
  }

  fetchAllNews() {
    this.service.fetchAllNews()
      .subscribe(res => {
        this.news = res;
        this.newsBackup = res;
        this.getRecentNews(5);
      });
  }

  getImageSource(image) {
    return `${configs.rootUrl}storages/news/download/${image}`;
  }

  getRecentNews(count) {
    if (this.news.length > count) {
      this.recentNews = this.news.slice(0, count - 1);
    } else {
      this.recentNews = this.news;
    }
  }

  viewNewsDetail(news) {
    this.router.navigate(['news', news.id]);
  }

  handleNewsCreated() {
    this.toggleCreateNews(false);
    this.fetchAllNews();
  }

  toggleCreateNews(value) {
    this.isCreateNewsActive = value;
  }

  showNewsDetail(news) {
    this.router.navigate(['news', news.id]);
  }

  onSearch() {
    if (this.keyword !== '') {
      if (this.news.length === 0) {
        this.news = this.newsBackup;
      }
      this.news = this.newsBackup.filter(item => item.title.toUpperCase().includes(this.keyword.toUpperCase()));
    } else {
      this.news = this.newsBackup;
    }
  }

}
