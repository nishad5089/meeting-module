import {RouterModule, Routes} from '@angular/router';
import {NgModule} from '@angular/core';
import {PermissionListComponent} from './permission-list/permission-list.component';
import {breadcrumb_path} from '../../../../constant/messages';


const ROUTES: Routes = [
  {
    path: 'get-list',
    component: PermissionListComponent,
    data: {
      title: breadcrumb_path.PERMISSIONS
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

export class PermissionRoutingModule {

}
