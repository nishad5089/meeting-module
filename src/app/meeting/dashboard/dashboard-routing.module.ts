import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {CalendarComponent} from './calendar/calendar.component';
import {ListComponent} from './list/list.component';
import {breadcrumb_path} from '../../constant/messages';


const routes: Routes = [
  {
    path: 'calendar', component: CalendarComponent,
    data: {
      title: breadcrumb_path.CALENDAR
    }
  },
  {
    path: 'list', component: ListComponent,
    data: {
      title: breadcrumb_path.LIST
    },
  },
  {
    path: '',
    redirectTo: 'calendar',
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DashboardRoutingModule {
}
