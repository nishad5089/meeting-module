import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {ReportsComponent} from './reports.component';
import {breadcrumb_path} from '../../constant/messages';

const routes: Routes = [
  {
    path: '',
    component: ReportsComponent,
    data: {
      title: breadcrumb_path.REPORTS
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ReportsRoutingModule {
}
