import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {GuestsListComponent} from 'app/meeting/guests/components/guests-list/guests-list.component';
import {END_POINT_SEARCH} from 'app/meeting/core/master.service';
import {GuestsComponent} from './guests.component';
import {breadcrumb_path} from '../../constant/messages';

const routes: Routes = [
  {
    path: '',
    component: GuestsComponent,
    children: [
      {
        path: 'settings',
        loadChildren: './settings/settings.module#SettingsModule'
      },
      {
        path: END_POINT_SEARCH,
        component: GuestsListComponent,
        data: {
          title: breadcrumb_path.LIST
        }
      },
      {
        path: '',
        redirectTo: END_POINT_SEARCH,
        pathMatch: 'full'
      }
    ],
    data: {
      title: breadcrumb_path.GUESTS
    }
  }
];

@NgModule({
  imports: [
    RouterModule.forChild(routes)
  ],
  exports: [RouterModule]
})
export class GuestsRoutingModule {
}
