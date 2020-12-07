import {NgModule} from '@angular/core';
import {CommonModule, DecimalPipe} from '@angular/common';
import {BackgroundComponent} from './component/background/background.component';
import {BasicInfoComponent, BasicInfoDialogComponent} from './component/basic-info/basic-info.component';
import {MembersComponent} from './component/members/members.component';
import {DocumentsComponent} from './component/documents/documents.component';
import {ActionLogComponent} from './component/action-log/action-log.component';
import {MeetingDetailsComponent} from './meeting-details.component';
import {AttendanceHonorariumDialogComponent} from './modal/atttendance-honorarium-dialog/attendance-honorarium-dialog';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {FlexModule} from '@angular/flex-layout';
import {AgendaFollowupDialogComponent} from './component/documents/modals/agenda-followup/add-agenda-followups.modal';
import {DocumentUploadDialogComponent} from './component/documents/modals/document-upload/document-upload.modal';
import {NoteDialogComponent} from './component/documents/modals/note/add-note.modal';
import {EditAndCopyMeetingModalComponent} from './modal/edit-and-copy-meeting-dialog/edit-and-copy-meeting.modal.component';
import {NgxMaterialTimepickerModule} from 'ngx-material-timepicker';
import {RescheduleMeetingModal} from './modal/reschedule-meeting-dialog/reschedule-meeting.modal';
import {RemarksDialogComponent} from '../../../app/meeting/meeting-details/component/members/modals/remarks/remarks.component.modal';
import {CancelMeetingModalComponent} from './modal/cancel-meeting-dialog/cancel-meeting.modal';
import {DemoMaterialModule} from '../../material.module';
import {SharedModule} from '../../shared/shared.module';
import {PdfViewerModalComponent} from '../../shared/pdf-viewer/pdf-viewer.modal';
import {MemberManagementComponent} from '../../shared/member-management/member-management.component';
import {MeetingDetailsRoutingModule} from './meeting-details-routing.module';
import {GroupDialogComponent} from './component/members/modals/group-dialog/group-dialog.component';
import {MeetingModule} from '../meeting.module';
import {ConfirmationComponent} from '../../shared/confirmation/confirmation.component';

@NgModule({
  declarations: [
    BackgroundComponent,
    BasicInfoComponent,
    MembersComponent,
    DocumentsComponent,
    ActionLogComponent,
    MeetingDetailsComponent,
    AttendanceHonorariumDialogComponent,
    BasicInfoDialogComponent,
    NoteDialogComponent,
    AgendaFollowupDialogComponent,
    DocumentUploadDialogComponent,
    GroupDialogComponent,
    EditAndCopyMeetingModalComponent,
    RescheduleMeetingModal,
    RemarksDialogComponent,
    CancelMeetingModalComponent
  ],
  entryComponents: [
    MemberManagementComponent,
    AttendanceHonorariumDialogComponent,
    BasicInfoDialogComponent,
    NoteDialogComponent,
    AgendaFollowupDialogComponent,
    DocumentUploadDialogComponent,
    GroupDialogComponent,
    EditAndCopyMeetingModalComponent,
    RescheduleMeetingModal,
    RemarksDialogComponent,
    CancelMeetingModalComponent,
    PdfViewerModalComponent,
    ConfirmationComponent
  ],
  imports: [
    MeetingDetailsRoutingModule,
    CommonModule,
    DemoMaterialModule,
    FormsModule,
    ReactiveFormsModule,
    FlexModule,
    NgxMaterialTimepickerModule,
    SharedModule,
    MeetingModule
  ],
  providers: [
    DecimalPipe
  ]
})
export class MeetingDetailsModule {
}
