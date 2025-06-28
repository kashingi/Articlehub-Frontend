import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LayoutComponent } from './layout/layout.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { GuardService } from '../services/guard.service';
import { HelpDetailsComponent } from './help-details/help-details.component';
import { ManageUsersComponent } from './manage-users/manage-users.component';
import { ManageCategoryComponent } from './manage-category/manage-category.component';
import { ManageArticleComponent } from './manage-article/manage-article.component';

const routes: Routes = [
  {
    path: '', component: LayoutComponent,
    children: [
      {
        path: 'dashboard', component: DashboardComponent,
        canActivate: [GuardService]
      },
      {
        path: 'users', component: ManageUsersComponent,
        canActivate: [GuardService]
      },
      {
        path: 'category', component: ManageCategoryComponent,
        canActivate: [GuardService]
      },
      {
        path: 'article', component: ManageArticleComponent,
        canActivate: [GuardService]
      },
      {
        path: 'help', component: HelpDetailsComponent,
        canActivate: [GuardService]
      },
      {
        path: '**', component: DashboardComponent,
        canActivate: [GuardService]
      }
    ]
  },

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule { }
