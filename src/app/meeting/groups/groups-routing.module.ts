import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {GroupListComponent} from 'app/meeting/groups/component/group-list/group-list.component';
import {GroupDetailsComponent} from 'app/meeting/groups/component/group-details/group-details.component';
import {END_POINT_SEARCH} from 'app/meeting/core/master.service';
import {breadcrumb_path} from '../../constant/messages';

const ROUTES: Routes = [
  {
    path: '',
    children: [{
      path: END_POINT_SEARCH, component: GroupListComponent,
      data: {
        title: breadcrumb_path.LIST
      }
    },
      {
        path: 'details/:oid', component: GroupDetailsComponent,
        data: {
          title: breadcrumb_path.DETAILS
        }
      },
      {
        path: '',
        redirectTo: END_POINT_SEARCH,
        pathMatch: 'full'
      }],
    data: {
      title: breadcrumb_path.GROUPS
    }
  }
];

@NgModule({
  imports: [
    RouterModule.forChild(ROUTES)
  ],
  exports: [
    RouterModule
  ]
})
export class GroupsRoutingModule {
}
