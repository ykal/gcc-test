import { Component, OnInit } from '@angular/core';
import {CategoryService} from '../category.service';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {AuthService} from '../../../Auth/services/auth.service';
import {SharedService} from '../../../shared/services/shared.service';

@Component({
  selector: 'app-categories-list',
  templateUrl: './categories-list.component.html',
  styleUrls: ['./categories-list.component.css']
})
export class CategoriesListComponent implements OnInit {

  public categories = [];
  public backUpcategories = [];
  public key = '';
  public categoryForm: FormGroup;
  public category = {category: ''};
  public page = 1;

  constructor(public service: CategoryService, public fb: FormBuilder, public authService: AuthService, public sharedService: SharedService) {
  }

  ngOnInit() {
    this.getCategories();
    this.categoryForm = this.fb.group({
      category: ['', Validators.required]
    });
  }

  onSearch($event) {
    if (this.key !== '' && this.backUpcategories.length > 0) {
      this.categories = this.backUpcategories.filter(item => item.category.toUpperCase().indexOf(this.key.toUpperCase()) !== -1);
  } else if (this.key === '') {
      this.categories = this.backUpcategories;
    }
}

  oncreateCategory() {
    this.service.addCategory(this.category)
      .subscribe(res => {
        this.sharedService.addToast('Success', 'New Category Added!.', 'success');
        this.categoryForm.reset();
        this.categories.push(res);
      }, err => {
        this.sharedService.addToast('Error', 'Error occurred!', 'error');
      });
  }

  getCategories() {
    this.service.getCategories()
      .subscribe(res => {
        this.categories = res;
        this.backUpcategories = this.categories;
      });
  }

  deleteCategory(category) {
    this.service.deleteCategory(category)
      .subscribe(res => {
        this.categories.splice(this.categories.indexOf(category), 1);
        this.sharedService.addToast('Success', 'Deleted Category Successfully!.', 'success');
      }, err => {
        this.sharedService.addToast('Error', 'Error occurred!.', 'error');
      });
  }

}
