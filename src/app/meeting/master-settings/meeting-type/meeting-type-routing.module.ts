import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {MeetingTypeListComponent} from 'app/meeting/master-settings/meeting-type/component/meeting-type-list/meeting-type-list.component';
import {MeetingTypeComponent} from './meeting-type.component';
import {breadcrumb_path} from '../../../constant/messages';

const ROUTES: Routes = [
  {
    path: '',
    component: MeetingTypeComponent,
    children: [
      {
        path: '',
        component: MeetingTypeListComponent,
        data: {
          title: breadcrumb_path.LIST
        }
      }
    ],
    data: {
      title: breadcrumb_path.TYPES
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(ROUTES)],
  exports: [RouterModule]
})
export class MeetingTypeRoutingModule {
}
