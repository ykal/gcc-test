import { CommonModule } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { SharedModule } from "../shared/shared.module";
import { NgModule } from "@angular/core";
import { AddUserComponent } from "./addUser/addUser.component";
import { UserListComponent } from "./userList/userList.component";
import { ExportDataComponent } from "./exportData/exportData.component";
import { ManageUserComponent } from "./manageUser/manageUser.component";
import { UserManagementService } from "./userManagament.service";
import { NgxPaginationModule } from "ngx-pagination";
import { UserProfileComponent } from "./userProfile/userProfile.component";
import { EditProfileComponent } from './edit-profile/edit-profile.component';
import { OwlDateTimeModule, OwlNativeDateTimeModule } from 'ng-pick-datetime';
import { NgxSpinnerModule } from 'ngx-spinner';
import { AssignRegionComponent } from './assign-region/assign-region.component';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { MultiselectDropdownModule } from 'angular-2-dropdown-multiselect';
import { RouterModule } from "@angular/router";


@NgModule({
  declarations: [
    AddUserComponent,
    UserListComponent,
    ExportDataComponent,
    ManageUserComponent,
    UserProfileComponent,
    EditProfileComponent,
    AssignRegionComponent
  ],
  imports: [
    SharedModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NgxPaginationModule,
    OwlDateTimeModule,
    OwlNativeDateTimeModule,
    NgxSpinnerModule,
    MultiselectDropdownModule
  ],
  providers: [UserManagementService],
  exports: [ManageUserComponent, ExportDataComponent]
})
export class UserManagementModule {}
