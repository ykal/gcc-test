import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { NewsService } from "../news.service";
import { configs } from "../../app.config";

@Component({
  selector: "app-news-detail",
  templateUrl: "./news-detail.component.html",
  styleUrls: ["./news-detail.component.css"]
})
export class NewsDetailComponent implements OnInit {
  public recentNews = [];
  public news = null;

  constructor(
    public route: ActivatedRoute,
    public servce: NewsService,
    public router: Router
  ) {}

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.fetchNews(params["id"]);
    });
    this.fetchRecentNews(5);
  }

  getImageSource(image) {
    return `${configs.rootUrl}storages/news/download/${image}`;
  }

  fetchRecentNews(count) {
    this.servce.fetchAllNews().subscribe(res => {
      if (res.length > count) {
        this.recentNews = res.slice(0, count - 1);
      } else {
        this.recentNews = res;
      }
    });
  }

  fetchNews(id) {
    this.servce.fetchNews(id).subscribe(
      res => {
        this.news = res;
      },
      err => {
        this.router.navigate(["/404"]);
      }
    );
  }

  backToNewsList() {
    this.router.navigate(["news"]);
  }
}
