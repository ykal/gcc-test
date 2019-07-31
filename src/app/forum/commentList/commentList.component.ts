import { Component, OnInit, Input } from '@angular/core';
import { ForumService } from '../forum.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { AuthService } from '../../Auth/services/auth.service';
import { SharedService } from '../../shared/services/shared.service';

@Component({
    selector: 'app-comment-list',
    templateUrl: './commentList.component.html',
    styleUrls: ['./commentList.component.css']
})

export class CommentListComponent implements OnInit {

    @Input() comments = [];
    @Input() isOwnerOfDiscussion = false;
    public page = 1;

    constructor(public service: ForumService, public authService: AuthService, public sharedService: SharedService) {

    }

    ngOnInit() {

    }

    removeComment($event) {
      this.service.removeComment($event.comment.id)
        .subscribe(res => {
          this.comments.splice(this.comments.indexOf($event.comment), 1);
          this.sharedService.addToast('Success', 'Successfuly deleted a comment.', 'success');
        }, error => {
          this.sharedService.addToast('', 'Error occured!', 'error');
      });
    }
}
