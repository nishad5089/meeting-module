import {NgModule} from '@angular/core';
import {
  MatCardModule,
  MatDialogModule,
  MatIconModule,
  MatInputModule,
  MatNativeDateModule,
  MatPaginatorModule,
  MatProgressSpinnerModule,
  MatSelectModule,
  MatSortModule,
  MatTableModule,
  MatTooltipModule
} from '@angular/material';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {HttpClientModule} from '@angular/common/http';
import {CommonModule} from '@angular/common';
import {MeetingRoomRoutingModule} from './meeting-room-routing.module';
import {MeetingRoomListComponent} from '../../master-settings/meeting-room/component/meeting-room-list/meeting-room-list.component';
import {MeetingRoomSaveComponent} from '../../master-settings/meeting-room/component/meeting-room-save/meeting-room-save.component';
import {ConfirmationComponent} from '../../../shared/confirmation/confirmation.component';
import {SharedModule} from '../../../shared/shared.module';
import {MeetingRoomComponent} from './meeting-room.component';
import {DemoMaterialModule} from '../../../material.module';


@NgModule({
  declarations: [
    MeetingRoomComponent,
    MeetingRoomListComponent,
    MeetingRoomSaveComponent
  ],
  entryComponents: [MeetingRoomSaveComponent, ConfirmationComponent],
  imports: [
    MatInputModule,
    FormsModule,
    HttpClientModule,
    MatNativeDateModule,
    ReactiveFormsModule,
    CommonModule,
    MeetingRoomRoutingModule,
    MatProgressSpinnerModule,
    MatCardModule,
    MatSelectModule,
    MatIconModule,
    MatTableModule,
    MatSortModule,
    MatPaginatorModule,
    MatTooltipModule,
    MatDialogModule,
    SharedModule,
    DemoMaterialModule
  ],
  exports: [
    MeetingRoomComponent
  ],
  providers: []
})

export class MeetingRoomModule {

}
