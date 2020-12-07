import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {roles} from '../constant/roles.constant';
import {AuthGuardService} from '../shared/security/service/auth-guard.service';

const routes: Routes = [
  {
    path: 'create',
    loadChildren: 'app/meeting/create-meeting/create-meeting.module#CreateMeetingModule',
    //canActivate: [AuthGuardService],
    data: {
      roles: [roles.MEM_MEETING_CREATOR, roles.MEM_DEV_ADMIN]
    }
  },
  {
    path: 'details/:oid',
    loadChildren: 'app/meeting/meeting-details/meeting-details.module#MeetingDetailsModule'
  },
  {
    path: 'settings',
    loadChildren: 'app/meeting/master-settings/master-settings.module#MasterSettingsModule',
    //canActivate: [AuthGuardService],
    data: {
      roles: [roles.MEM_MEETING_ADMIN, roles.MEM_DEV_ADMIN]
    }
  },
  {
    path: 'todos/:index',
    loadChildren: './todos/todos.module#TodosModule'
  },
  {
    path: 'guests',
    loadChildren: 'app/meeting/guests/guests.module#GuestsModule'
  },
  {
    path: 'reports',
    loadChildren: 'app/meeting/reports/reports.module#ReportsModule'
  },
  // {
  //   path: 'member-management', loadChildren: 'app/meeting/member-management/member-management.module#MemberManagementModule'
  // },
  {
    path: 'groups',
    loadChildren: 'app/meeting/groups/groups.module#GroupsModule'
  },
  {
    path: 'external-meetings',
    loadChildren: 'app/meeting/external-meeting/external-meeting.module#ExternalMeetingModule'
  },
  {
    path: '',
    loadChildren: 'app/meeting/dashboard/dashboard.module#DashboardModule'
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MeetingRoutingModule {
}
