import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {MeetingFrequencyListComponent} from 'app/meeting/master-settings/meeting-frequency/component/meeting-frequency-list/meeting-frequency-list.component';
import {MeetingFrequencySaveComponent} from 'app/meeting/master-settings/meeting-frequency/component/meeting-frequency-save/meeting-frequency-save.component';
import {MeetingFrequencyRoutingModule} from 'app/meeting/master-settings/meeting-frequency/meeting-frequency-routing.module';
import {
  MatButtonModule,
  MatCardModule,
  MatDialogModule,
  MatFormFieldModule,
  MatIconModule,
  MatInputModule,
  MatPaginatorModule,
  MatProgressSpinnerModule,
  MatSortModule,
  MatTableModule,
  MatTooltipModule
} from '@angular/material';
import {FormsModule} from '@angular/forms';
import {MeetingFrequencyComponent} from './meeting-frequency.component';
import {SharedModule} from '../../../shared/shared.module';

@NgModule({
  declarations: [
    MeetingFrequencyComponent,
    MeetingFrequencyListComponent,
    MeetingFrequencySaveComponent
  ],
  imports: [
    CommonModule,
    MeetingFrequencyRoutingModule,
    MatFormFieldModule,
    FormsModule,
    MatDialogModule,
    MatIconModule,
    MatCardModule,
    MatProgressSpinnerModule,
    MatTableModule,
    MatSortModule,
    MatPaginatorModule,
    MatTooltipModule,
    MatButtonModule,
    MatInputModule,
    SharedModule
  ],
  exports: [
    MeetingFrequencyComponent
  ],
  entryComponents: [
    MeetingFrequencySaveComponent
  ]
})
export class MeetingFrequencyModule {
}
