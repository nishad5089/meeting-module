import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {RolesListComponent} from './roles-list/roles-list.component';
import {breadcrumb_path} from '../../../../constant/messages';


const ROUTES: Routes = [
  {
    path: 'get-list',
    component: RolesListComponent,
    data: {
      title: breadcrumb_path.ROLES
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

export class RolesRoutingModule {

}
