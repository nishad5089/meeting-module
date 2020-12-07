import {NgModule} from '@angular/core';
import {MasterSettingsRoutingModule} from './master-settings-routing.module';
import {BuildingModule} from './building/building.module';
import {MeetingRoomModule} from './meeting-room/meeting-room.module';
import {MeetingTypeModule} from './meeting-type/meeting-type.module';
import {MeetingFrequencyModule} from './meeting-frequency/meeting-frequency.module';
import {AclModule} from './acl/acl.module';
import {MasterSettingsComponent} from './master-settings.component';

@NgModule({
declarations: [
  MasterSettingsComponent
],
imports: [
MasterSettingsRoutingModule,
  BuildingModule,
  MeetingRoomModule,
  MeetingTypeModule,
  MeetingFrequencyModule,
  AclModule
]
})
export class MasterSettingsModule {
}
