import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TagManagmentComponent } from './tag-managment/tag-managment.component';
import {TagService} from './tag.service';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {SharedModule} from '../../shared/shared.module';
import {ToastyModule} from 'ng2-toasty';
import {NgxPaginationModule} from 'ngx-pagination';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule,
    ToastyModule,
    NgxPaginationModule
  ],
  declarations: [TagManagmentComponent],
  exports: [TagManagmentComponent],
  providers: [TagService]
})
export class TagModule { }
