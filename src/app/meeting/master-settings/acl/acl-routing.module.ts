import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {AclComponent} from './acl.component';
import {breadcrumb_path} from '../../../constant/messages';
import {roles} from '../../../constant/roles.constant';
import {AuthGuardService} from '../../../shared/security/service/auth-guard.service';


const ROUTES: Routes = [
  {
    path: '',
    component: AclComponent,
    children: [
      {
        path: 'roles',
        loadChildren: 'app/meeting/master-settings/acl/roles/roles.module#RolesModule',
        data: {
          roles: [roles.MEM_DEV_ADMIN]
        },
        //canActivate: [AuthGuardService]
      },
      {
        path: 'user-roles',
        loadChildren: 'app/meeting/master-settings/acl/user-roles/user-roles.module#UserRolesModule'
      },
      {
        path: 'permissions',
        loadChildren: 'app/meeting/master-settings/acl/permission/permission.module#PermissionModule'
      },
      {
        path: 'actions',
        loadChildren: 'app/meeting/master-settings/acl/action/action.module#ActionModule',
        data: {
          roles: [roles.MEM_DEV_ADMIN]
        },
       // canActivate: [AuthGuardService]
      },
      {
        path: 'status',
        loadChildren: 'app/meeting/master-settings/acl/meeting-status/meeting-status.module#MeetingStatusModule',
        data: {
          roles: [roles.MEM_DEV_ADMIN]
        },
       // canActivate: [AuthGuardService]
      },
      {
        path: '',
        redirectTo: 'user-roles',
        pathMatch: 'full'
      }
    ],
    data: {
      title: breadcrumb_path.ACL
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(ROUTES)],
  exports: [RouterModule]
})

export class AclRoutingModule {

}
