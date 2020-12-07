import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {BackgroundComponent, BackgroundUploadComponent} from './component/background/background.component';
import {KeyPersonnelComponent} from './component/key-personnel/key-personnel.component';
import {AttachmentsComponent, FileUploadDialogComponent} from './component/attachments/attachments.component';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {MatOptionModule} from '@angular/material';
import {CreateMeetingComponent} from '../../meeting/create-meeting/create-meeting.component';
import {BasicInfoComponent} from '../../meeting/create-meeting/component/basic-info/basic-info.component';
import {BasicInfoScheduleComponent} from '../../meeting/create-meeting/component/basic-info/modal/basic-info-schedule/basic-info-schedule.modal';
import {DemoMaterialModule} from '../../material.module';
import {NgxMaterialTimepickerModule} from 'ngx-material-timepicker';
import {AgendaComponent} from '../../meeting/create-meeting/component/agenda/agenda.component';
import {AddAgendaModalComponent} from '../../meeting/create-meeting/component/agenda/modal/add/add-agenda.modal';
import {CreateMeetingRoutingModule} from './create-meeting-routing.module';
import {SharedModule} from '../../shared/shared.module';
import {ConfirmationComponent} from '../../shared/confirmation/confirmation.component';

@NgModule({
  declarations: [
    BackgroundComponent,
    BasicInfoComponent,
    KeyPersonnelComponent,
    AttachmentsComponent,
    CreateMeetingComponent,
    AddAgendaModalComponent,
    FileUploadDialogComponent,
    BackgroundUploadComponent,
    BasicInfoScheduleComponent,
    AgendaComponent
  ],
  entryComponents: [
    AddAgendaModalComponent,
    FileUploadDialogComponent,
    BackgroundUploadComponent,
    BasicInfoScheduleComponent,
    ConfirmationComponent
  ],
  imports: [
    CreateMeetingRoutingModule,
    CommonModule,
    DemoMaterialModule,
    ReactiveFormsModule,
    FormsModule,
    NgxMaterialTimepickerModule,
    MatOptionModule,
    SharedModule,
  ]
})
export class CreateMeetingModule {
}
