/** @kal **/
import { Routes } from "@angular/router";
import { LandingPageComponent } from "./landing-page/landing-page.component";
import { AUTH_ROUTES } from "./Auth/auth.routes";
import { ForumRoutes } from "./forum/forum.route";
import { NEWS_ROUTES } from "./news/news.router";
import { WinnerComponent } from "./winnerProject/winner/winner.component";
import { PageNotFoundComponent } from "./page-not-found/page-not-found.component";
import { DashboardGuardService } from "./Auth/services/dashboard-guard.service";

export const APP_ROUTES: Routes = [
  { path: "", pathMatch: 'full', component: LandingPageComponent },
  ...AUTH_ROUTES,
  { path: "forums", loadChildren: "./forum/forum.module#ForumModule" },
  {
    path: "my-projects",
    loadChildren: "./project/project.module#ProjectModule"
  },
  {
    path: "resources",
    loadChildren: "./resources/resources.module#ResourcesModule"
  },
  // { path: 'news', loadChildren: './news/news.module#NewsModule' },
  {
    path: "events",
    loadChildren: "./solveitTeam/solveitTeam.module#SolveitTeamModule"
  },
  {
    path: "dashboard",
    loadChildren: "./dashboard/dashboard.module#DashboardModule"
  },
  {
    path: "winners",
    // component: WinnerComponent,
    // canActivate: [DashboardGuardService]
    loadChildren: "./winnerProject/winnerProject.module#WinnerProjectModule"
  },
  {
    path: "sponsors",
    loadChildren: "./sponsors/sponsors.module#SponsorsModule"
  },
  { path: "404", component: PageNotFoundComponent },
  { path: '**', redirectTo: '/404' }
];
