import { Routes } from '@angular/router';
import { ForumComponent } from './forum.component';
import { ForumViewComponent } from './forumView/forumView.component';
import { DiscussionViewComponent } from './discussionView/discussionView.component';

export const ForumRoutes: Routes = [
  {
    path: '',
    children: [
      {path: '', component: ForumComponent},
      { path: 'discussions/:slung', component: DiscussionViewComponent },
      {path: ':slung', component: ForumViewComponent},
    ]
  },
];
