import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ConfirmationComponent} from './confirmation/confirmation.component';
import {
  MatCardModule,
  MatDialogModule,
  MatIconModule,
  MatInputModule,
  MatPaginatorModule,
  MatTableModule,
  MatTooltipModule
} from '@angular/material';
import {AddGuestComponent} from './add-guest/add-guest.component';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {DemoMaterialModule} from '../material.module';
import {SpeedDialFabComponent} from './speed-dial-fab/speed-dial-fab.component';
import {FlexModule} from '@angular/flex-layout';
import {MemberManagementComponent} from './member-management/member-management.component';
import {GuestsComponent} from './member-management/component/guests/guests.component';
import {EmployeesComponent} from './member-management/component/employees/employees.component';
import {PdfViewerModalComponent} from './pdf-viewer/pdf-viewer.modal';
import {NgxExtendedPdfViewerModule} from 'ngx-extended-pdf-viewer';
import {GroupsComponent} from './member-management/component/groups/groups.component';
import {AlertComponent} from './alert/alert.component';
import {RoomsComponent} from './autocomplete/rooms.component';
import {MeetingTypesComponent} from './autocomplete/meeting-types.component';
import {GuestOfficeComponent} from './autocomplete/guest-office.component';
import {GuestOrganizationComponent} from './autocomplete/guest-organization.component';
import {GuestDepartmentComponent} from './autocomplete/guest-department.component';
import {GuestDesignationComponent} from './autocomplete/guest-designation.component';
import {PreviousReferenceAutocompleteComponent} from './autocomplete/previous-reference-autocomplete.component';
import {MeetingAgendaComponent} from './autocomplete/meeting-agenda.component';
import {SpeakerAutocompleteComponent} from './autocomplete/speaker-autocomplete.component';
import {MeetingStatusComponent} from './autocomplete/meeting-status.component';
import {BuildingComponent} from './autocomplete/building.component';
import {MeetingFrequencyComponent} from './autocomplete/meeting-frequency.component';
import {LocalNumberPipe} from './pipes/locale-number.pipe';
import {MemTranslatePipe} from './pipes/mem-translate.pipe';
import {Nl2brPipe} from './pipes/nl2br.pipe';
import {P404Component} from './error/404.component';
import {UnauthorizedComponent} from './error/unauthorized.component';
import {TimeAgoPipe} from 'time-ago-pipe';
import {EmployeeOfficeComponent} from './autocomplete/employee-office.component';
import {EmployeeDepartmentComponent} from './autocomplete/employee-department.component';
import {EmployeeDesignationComponent} from './autocomplete/employee-designation.component';

@NgModule({
  declarations: [
    ConfirmationComponent,
    AddGuestComponent,
    PdfViewerModalComponent,
    SpeedDialFabComponent,
    MemberManagementComponent,
    GuestsComponent,
    EmployeesComponent,
    GroupsComponent,
    AlertComponent,
    RoomsComponent,
    MeetingTypesComponent,
    GuestOfficeComponent,
    GuestOrganizationComponent,
    GuestDepartmentComponent,
    GuestDesignationComponent,
    EmployeeOfficeComponent,
    EmployeeDepartmentComponent,
    EmployeeDesignationComponent,
    PreviousReferenceAutocompleteComponent,
    MeetingAgendaComponent,
    MeetingStatusComponent,
    SpeakerAutocompleteComponent,
    BuildingComponent,
    MeetingFrequencyComponent,
    LocalNumberPipe,
    MemTranslatePipe,
    Nl2brPipe,
    P404Component,
    UnauthorizedComponent,
    TimeAgoPipe
  ],
  imports: [
    CommonModule,
    MatDialogModule,
    MatCardModule,
    FormsModule,
    DemoMaterialModule,
    ReactiveFormsModule,
    MatInputModule,
    MatIconModule,
    MatTableModule,
    MatPaginatorModule,
    MatTooltipModule,
    NgxExtendedPdfViewerModule,
    FlexModule
  ],
  exports: [
    SpeedDialFabComponent,
    AlertComponent,
    RoomsComponent,
    MeetingTypesComponent,
    GuestOfficeComponent,
    GuestOrganizationComponent,
    GuestDepartmentComponent,
    GuestDesignationComponent,
    PreviousReferenceAutocompleteComponent,
    MeetingAgendaComponent,
    MeetingStatusComponent,
    SpeakerAutocompleteComponent,
    BuildingComponent,
    MeetingFrequencyComponent,
    LocalNumberPipe,
    MemTranslatePipe,
    Nl2brPipe,
    P404Component,
    UnauthorizedComponent,
    TimeAgoPipe
  ],
  entryComponents: [
    AddGuestComponent,
    MemberManagementComponent
  ]
})
export class SharedModule {
}
