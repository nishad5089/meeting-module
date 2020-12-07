import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {END_POINT_SEARCH} from 'app/meeting/core/master.service';
import {ExternalMeetingListComponent} from './component/external-meeting-list/external-meeting-list.component';
import {breadcrumb_path} from '../../constant/messages';

const ROUTES: Routes = [
  {
    path: END_POINT_SEARCH, component: ExternalMeetingListComponent,
    data: {
      title: breadcrumb_path.EXTERNAL_MEETING
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
export class ExternalMeetingRoutingModule {
}
