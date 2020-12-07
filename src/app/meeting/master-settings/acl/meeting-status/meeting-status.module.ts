import {NgModule} from '@angular/core';
import {
  MatCardModule,
  MatDialogModule,
  MatIconModule,
  MatInputModule, MatOptionModule,
  MatPaginatorModule,
  MatProgressSpinnerModule, MatSelectModule,
  MatSortModule,
  MatTableModule,
  MatTooltipModule
} from '@angular/material';
import {FormsModule} from '@angular/forms';
import {CommonModule} from '@angular/common';
import {MeetingStatusListComponent} from './meeting-status-list/meeting-status-list.component';
import {MeetingStatusCreateComponent} from './meeing-status-create/meeting-status-create.component';
import {MeetingStatusRoutingModule} from './meeting-status-routing.module';
import {SharedModule} from '../../../../shared/shared.module';


@NgModule({
  declarations: [MeetingStatusListComponent, MeetingStatusCreateComponent],
  entryComponents: [MeetingStatusCreateComponent],
  imports: [
    MeetingStatusRoutingModule,
    MatIconModule,
    MatCardModule,
    MatProgressSpinnerModule,
    MatInputModule,
    FormsModule,
    MatTableModule,
    MatPaginatorModule,
    MatTooltipModule,
    CommonModule,
    MatSortModule,
    MatDialogModule,
    MatOptionModule,
    MatSelectModule,
    SharedModule
  ]
})

export class MeetingStatusModule {

}
