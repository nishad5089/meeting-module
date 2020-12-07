import {RouterModule, Routes} from '@angular/router';
import {NgModule} from '@angular/core';
import {MeetingStatusListComponent} from './meeting-status-list/meeting-status-list.component';
import {breadcrumb_path} from '../../../../constant/messages';

const ROUTES: Routes = [
  {
    path: 'get-list',
    component: MeetingStatusListComponent,
    data: {
      title: breadcrumb_path.MEETING_STATUS
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

export class MeetingStatusRoutingModule {

}
