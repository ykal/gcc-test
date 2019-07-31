import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Router} from '@angular/router';

@Component({
  selector: 'app-recent-news',
  templateUrl: './recent-news.component.html',
  styleUrls: ['./recent-news.component.css']
})
export class RecentNewsComponent implements OnInit {

  @Input() recentNews = [];
  @Input() isBackVisible = false;
  @Output() backEvent = new EventEmitter();
  nextDay: Date;

  constructor(public router: Router) { }

  ngOnInit() {
    this.nextDay = new Date();
  }

  viewNewsDetail(news) {
    this.router.navigate(['news', news.id]);
    this.nextDay.setDate(this.nextDay.getDate() + 1);
  }

  back() {
    this.backEvent.emit();
  }

}
