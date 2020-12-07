import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {END_POINT_SEARCH} from '../../../app/meeting/core/master.service';
import {MasterSettingsComponent} from './master-settings.component';
import {breadcrumb_path} from '../../constant/messages';

const routes: Routes = [
  {
    path: '',
    component: MasterSettingsComponent,
    children: [
      {
        path: 'acl',
        loadChildren: 'app/meeting/master-settings/acl/acl.module#AclModule'
      },
      {
        path: 'frequencies/' + END_POINT_SEARCH,
        loadChildren: 'app/meeting/master-settings/meeting-frequency/meeting-frequency.module#MeetingFrequencyModule'
      },
      {
        path: 'types/' + END_POINT_SEARCH,
        loadChildren: 'app/meeting/master-settings/meeting-type/meeting-type.module#MeetingTypeModule'
      },
      {
        path: 'buildings/' + END_POINT_SEARCH,
        loadChildren: 'app/meeting/master-settings/building/building.module#BuildingModule'
        // loadChildren: () => BuildingModule
      },
      {
        path: 'rooms/' + END_POINT_SEARCH,
        loadChildren: 'app/meeting/master-settings/meeting-room/meeting-room.module#MeetingRoomModule'
      },
      {
        path: 'templates/' + END_POINT_SEARCH,
        loadChildren: 'app/meeting/master-settings/meeting-template-file/meeting-template.module#MeetingTemplateModule'
      },
      // {
      //   path: 'meeting-tax-rate-setup/' + END_POINT_SEARCH,
      //   loadChildren: 'app/meeting/master-settings/meeting-tax-rate-setup/meeting-tax-rate-setup.module#MeetingTaxRateSetupModule'
      // },
      // {
      //   path: 'meeting-revenue-stamp-fee-setup/' + END_POINT_SEARCH,
      //   loadChildren: 'app/meeting/master-settings/meeting-revenue-stamp-fee-setup/meeting-revenue-stamp-fee-setup.module#MeetingRevenueStampFeeSetupModule'
      // },
      // {
      //   path: 'meeting-template-file/' + END_POINT_SEARCH,
      //   loadChildren: 'app/meeting/master-settings/meeting-template-file/meeting-template.module#MeetingTemplateModule'
      // },
      // {
      //   path: 'meeting-status/' + END_POINT_SEARCH,
      //   loadChildren: 'app/meeting/master-settings/meeting-status/meeting-status-module/meeting-status.module#MeetingStatusModule'
      // }
      {
        path: '',
        redirectTo: 'frequencies/' + END_POINT_SEARCH,
        pathMatch: 'full'
      }
    ],
    data: {
      title: breadcrumb_path.MASTER_SETTINGS
    }
  }
];

@NgModule({
  imports: [
    RouterModule.forChild(routes)
  ],
  exports: [RouterModule]
})
export class MasterSettingsRoutingModule {
}
