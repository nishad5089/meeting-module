import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {MeetingTemplateListComponent} from './component/meeting-template-list/meeting-template-list.component';
import {MeetingTemplateComponent} from './meeting-template.component';
import {breadcrumb_path} from '../../../constant/messages';

const ROUTES: Routes = [
  {
    path: '',
    component: MeetingTemplateComponent,
    children: [
      {
        path: '',
        component: MeetingTemplateListComponent,
        data: {
          title: breadcrumb_path.LIST
        }
      }
    ],
    data: {
      title: breadcrumb_path.TEMPLATES
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(ROUTES)],
  exports: [RouterModule]
})
export class MeetingTemplateRoutingModule {
}
