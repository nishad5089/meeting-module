import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {MeetingRoomListComponent} from 'app/meeting/master-settings/meeting-room/component/meeting-room-list/meeting-room-list.component';
import {MeetingRoomComponent} from './meeting-room.component';
import {breadcrumb_path} from '../../../constant/messages';

const ROUTES: Routes = [
  {
    path: '',
    component: MeetingRoomComponent,
    children: [
      {
        path: '',
        component: MeetingRoomListComponent,
        data: {
          title: breadcrumb_path.LIST
        }
      }
    ],
    data: {
      title: breadcrumb_path.ROOMS
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(ROUTES)],
  exports: [RouterModule]
})
export class MeetingRoomRoutingModule {
}
