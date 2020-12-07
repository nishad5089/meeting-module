import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {SettingsComponent} from './settings.component';
import {END_POINT_SEARCH} from '../../core/master.service';
import {SettingsListComponent} from './components/settings-list/settings-list.component';
import {breadcrumb_path} from '../../../constant/messages';

const routes: Routes = [
  {
    path: '',
    component: SettingsComponent,
    children: [
      {
        path: END_POINT_SEARCH,
        component: SettingsListComponent,
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
      title: breadcrumb_path.SETTINGS
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes),
  ],
  exports: [RouterModule]
})
export class SettingsRoutingModule {
}
