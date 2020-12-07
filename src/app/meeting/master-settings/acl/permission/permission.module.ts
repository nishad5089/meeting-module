import {
  MatCardModule, MatCheckboxModule,
  MatDialogModule,
  MatIconModule,
  MatInputModule,
  MatPaginatorModule,
  MatProgressSpinnerModule,
  MatSortModule,
  MatTableModule,
  MatTooltipModule
} from '@angular/material';
import {FormsModule} from '@angular/forms';
import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';

import {PermissionListComponent} from './permission-list/permission-list.component';
import {PermissionRoutingModule} from './permission-routing.module';
import {MeetingStatusModalComponent} from './permission-list/meeting-status.modal.component';
import {DemoMaterialModule} from '../../../../material.module';


@NgModule({
  declarations: [
    PermissionListComponent,
    MeetingStatusModalComponent
  ],
  entryComponents: [
    MeetingStatusModalComponent
  ],
  imports: [
    PermissionRoutingModule,
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
    MatCheckboxModule,
    DemoMaterialModule
  ]
})

export class PermissionModule {

}
