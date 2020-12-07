import {NgModule} from '@angular/core';
import {CommonModule, DecimalPipe} from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {FlexModule} from '@angular/flex-layout';
import {DemoMaterialModule} from '../../material.module';
import {ExternalMeetingRoutingModule} from './external-meeting-routing.module';
import {ExternalMeetingListComponent} from './component/external-meeting-list/external-meeting-list.component';
import {ExternalMeetingCreateComponent} from './component/external-meeting-create/external-meeting-create.component';
import {NgxMaterialTimepickerModule} from 'ngx-material-timepicker';
import {ExternalMeetingDetailsComponent} from './component/external-meeting-details/external-meeting-details.component';
import {SharedModule} from '../../shared/shared.module';
import {ConfirmationComponent} from '../../shared/confirmation/confirmation.component';

@NgModule({
  declarations: [
    ExternalMeetingListComponent,
    ExternalMeetingCreateComponent,
    ExternalMeetingDetailsComponent
  ],
  entryComponents: [
    ExternalMeetingCreateComponent,
    ExternalMeetingDetailsComponent,
    ConfirmationComponent
  ],
  imports: [
    ExternalMeetingRoutingModule,
    CommonModule,
    DemoMaterialModule,
    FormsModule,
    ReactiveFormsModule,
    FlexModule,
    NgxMaterialTimepickerModule,
    SharedModule
  ],
  exports: [
  ],
  providers: [
    DecimalPipe
  ]
})
export class ExternalMeetingModule {
}
