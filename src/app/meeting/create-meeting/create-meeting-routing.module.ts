import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {CreateMeetingComponent} from './create-meeting.component';
import {breadcrumb_path} from '../../constant/messages';

const routes: Routes = [
  {
    path: '',
    component: CreateMeetingComponent,
    data: {
      title: breadcrumb_path.CREATE_MEETING
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CreateMeetingRoutingModule {
}
