import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { CreateNewsComponent } from "./create-news/create-news.component";
import { NewsListComponent } from "./news-list/news-list.component";
import { NewsDetailComponent } from "./news-detail/news-detail.component";
import { NewsService } from "./news.service";
import { SharedModule } from "../shared/shared.module";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { FileUploadModule } from "ng2-file-upload";
import { NgCircleProgressModule } from "ng-circle-progress";
import { NgxPaginationModule } from "ngx-pagination";
import { ToastyModule } from "ng2-toasty";
import { RecentNewsComponent } from "./recent-news/recent-news.component";
import { MomentModule } from "angular2-moment";
import { NgxWigModule } from "ngx-wig";
import { RouterModule } from '@angular/router';
import { NEWS_ROUTES } from './news.router';

@NgModule({
  imports: [
    RouterModule.forChild(NEWS_ROUTES),
    CommonModule,
    SharedModule,
    FormsModule,
    NgxPaginationModule,
    ToastyModule,
    ReactiveFormsModule,
    FileUploadModule,
    NgCircleProgressModule,
    MomentModule,
    NgxWigModule
  ],
  declarations: [
    CreateNewsComponent,
    NewsListComponent,
    NewsDetailComponent,
    RecentNewsComponent
  ],
  providers: [NewsService]
})
export class NewsModule {}
