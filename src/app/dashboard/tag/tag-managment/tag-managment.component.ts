import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {AuthService} from '../../../Auth/services/auth.service';
import {SharedService} from '../../../shared/services/shared.service';
import {TagService} from '../tag.service';

@Component({
  selector: 'app-tag-managment',
  templateUrl: './tag-managment.component.html',
  styleUrls: ['./tag-managment.component.css']
})
export class TagManagmentComponent implements OnInit {
  public tags = [];
  public backUpTags = [];
  public key = '';
  public tagForm: FormGroup;
  public tag = {name: ''};
  public page = 1;

  constructor(public service: TagService, public fb: FormBuilder, public authService: AuthService, public sharedService: SharedService) {
  }

  ngOnInit() {
    this.getTags();
    this.tagForm = this.fb.group({
      name: ['', Validators.required]
    });
  }

  onSearch($event) {
    if (this.key !== '' && this.backUpTags.length > 0) {
      this.tags = this.backUpTags.filter(item => item.name.toUpperCase().indexOf(this.key.toUpperCase()) !== -1);
    } else if (this.key === '') {
      this.tags = this.backUpTags;
    }
  }

  onCreateTag() {
    this.service.addTag(this.tag)
      .subscribe(res => {
        this.sharedService.addToast('Success', 'New Tag Added!.', 'success');
        this.tagForm.reset();
        this.tags.push(res);
      }, err => {
        this.sharedService.addToast('Error', 'Error occurred!', 'error');
      });
  }

  getTags() {
    this.service.getTags()
      .subscribe(res => {
        this.tags = res;
        this.backUpTags = this.tags;
      });
  }

  deleteTag(tag) {
    this.service.deleteTag(tag)
      .subscribe(res => {
        this.tags.splice(this.tags.indexOf(tag), 1);
        this.sharedService.addToast('Success', 'Deleted Tag Successfully!.', 'success');
      }, err => {
        this.sharedService.addToast('Error', 'Error occurred!.', 'error');
      });
  }

}
