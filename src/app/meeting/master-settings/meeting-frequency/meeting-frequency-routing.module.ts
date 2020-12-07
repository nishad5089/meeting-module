import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {MeetingFrequencyListComponent} from 'app/meeting/master-settings/meeting-frequency/component/meeting-frequency-list/meeting-frequency-list.component';
import {MeetingFrequencyComponent} from './meeting-frequency.component';
import {breadcrumb_path} from '../../../constant/messages';

const ROUTES: Routes = [
  {
    path: '',
    component: MeetingFrequencyComponent,
    children: [
      {
        path: '',
        component: MeetingFrequencyListComponent,
        data: {
          title: breadcrumb_path.LIST
        }
      }
    ],
    data: {
      title: breadcrumb_path.FREQUENCIES
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(ROUTES)],
  exports: [RouterModule]
})
export class MeetingFrequencyRoutingModule {
}
