import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {MeetingDetailsComponent} from './meeting-details.component';
import {breadcrumb_path} from '../../constant/messages';

const routes: Routes = [
    {
      path: '',
      component: MeetingDetailsComponent,
      data: {
        title: breadcrumb_path.DETAILS
      }
    }
  ]
;

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MeetingDetailsRoutingModule {
}
