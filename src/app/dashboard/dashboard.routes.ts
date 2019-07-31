import { Routes } from "@angular/router";
import { DashboardComponent } from "./dashboard.component";
import { DashboardGuardService } from "../Auth/services/dashboard-guard.service";
import { CompetitionProjectsComponent } from "../competition/competitionProjects/competitionProjects.component";
import { UserProfileComponent } from "../userManagement/userProfile/userProfile.component";
import { UserListComponent } from "../userManagement/userList/userList.component";
import { CompetitionViewComponent } from "../competition/competitionView/competitionView.component";
import { ManageUserComponent } from "../userManagement/manageUser/manageUser.component";
import { CategoriesListComponent } from "./category/categories-list/categories-list.component";
import { TagManagmentComponent } from "./tag/tag-managment/tag-managment.component";
import { ReviewDiscussionComponent } from "./reviewDiscussion/reviewDiscussion.component";
import { CityListComponent } from "./city/cityList/cityList.component";
import { ExportDataComponent } from "../userManagement/exportData/exportData.component";
import { AdminGuardService } from "../Auth/services/admin-guard.service";
import { SolveitMgmtGuardService } from "../Auth/services/solveit-mgmt-guard.service";
import { UserModuleGuardService } from "../Auth/services/userModuleGuard.service";

export const DASHBOARD_ROUTES: Routes = [
  {
    path: "",
    component: DashboardComponent,
    canActivate: [DashboardGuardService],
    children: [
      {
        path: "",
        pathMatch: "full",
        redirectTo: "users"
      },
      {
        path: "users",
        component: ManageUserComponent,
        canActivate: [UserModuleGuardService]
      },
      {
        path: "competitions",
        children: [
          { path: "", component: CompetitionViewComponent },
          { path: ":id", component: CompetitionProjectsComponent }
        ]
      },
      { path: "categories", component: CategoriesListComponent },
      { path: "tags", component: TagManagmentComponent },
      { path: "review-discussion", component: ReviewDiscussionComponent },
      { path: "cities", component: CityListComponent },
      { path: "export-data", component: ExportDataComponent }
    ]
  },
  {
    path: "competitions/:competitionId",
    component: CompetitionProjectsComponent,
    canActivate: [DashboardGuardService]
  },
  { path: "userProfile/:userId", component: UserProfileComponent }
];
