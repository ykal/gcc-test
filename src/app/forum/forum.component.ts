import { Component, OnInit } from '@angular/core';
import { ForumService } from './forum.service';
import { AuthService } from '../Auth/services/auth.service';
import { SharedService } from '../shared/services/shared.service';

@Component({
    selector: 'app-forum',
    templateUrl: './forum.component.html',
    styleUrls: ['./forum.component.css']
})

export class ForumComponent implements OnInit {

    public selected = 'forum-list-public';
    public categories = [];
    public favouritePage = 1;
    public favouriteDiscussions = [];
    public favouriteDiscussionsBackup = [];
    public keyword = '';

    constructor(public service: ForumService, public authService: AuthService, public sharedService: SharedService) {}

    ngOnInit() {
        this.getCategories();
    }

    toggleView(view) {
        this.selected = view;
    }

    getCategories() {
        this.service.getCategories().subscribe(
            res => {
                this.categories = res;
            }
        );
    }

    getFavouriteDiscussions() {
        this.selected = 'favourite-discussions';
        const userId = this.authService.getUserId();

        if (userId) {
          this.service.getFavouriteDiscussions(userId).subscribe(
            res => {
              this.favouriteDiscussions = res;
              this.favouriteDiscussionsBackup = res;
            }
          );
        }
    }

    onSearch($event) {
        if (this.keyword !== '') {
          this.favouriteDiscussions = this.favouriteDiscussions.filter(item => item.content.includes(this.keyword));
        } else {
          this.favouriteDiscussions = this.favouriteDiscussionsBackup;
        }
    }

    countComments(discussion) {
        let count = 0;
        this.service.countComments(discussion.id).subscribe(
            res => {
                count = res.count;
            }
        );
        return count;
    }

    forumCreated() {
        this.toggleView('forum-list-public');
    }
}
