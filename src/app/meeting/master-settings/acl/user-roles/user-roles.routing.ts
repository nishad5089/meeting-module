import {RouterModule, Routes} from '@angular/router';
import {NgModule} from '@angular/core';
import {breadcrumb_path} from '../../../../constant/messages';
import {UserRolesComponent} from './user-roles.component';

const ROUTES: Routes = [
  {
    path: 'get-list',
    component: UserRolesComponent,
    data: {
      title: breadcrumb_path.USER_ROLES
    }
  },
  {
    path: '',
    redirectTo: 'get-list',
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [RouterModule.forChild(ROUTES)],
  exports: [RouterModule]
})


export class UserRolesRouting {
}
