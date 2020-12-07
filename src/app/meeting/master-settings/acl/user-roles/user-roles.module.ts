import {
  MatCardModule,
  MatDialogModule,
  MatIconModule,
  MatInputModule,
  MatPaginatorModule,
  MatProgressSpinnerModule,
  MatSortModule,
  MatTableModule,
  MatTooltipModule
} from '@angular/material';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import {UserRolesRouting} from './user-roles.routing';
import {DemoMaterialModule} from '../../../../material.module';
import {SharedModule} from '../../../../shared/shared.module';
import {MeetingCreatorListComponent} from './component/meeting-creator/meeting-creator-list/meeting-creator-list.component';
import {MeetingAdminComponent} from './component/meeting-admin/meeting-admin.component';
import {UserRolesComponent} from './user-roles.component';
import {MeetingCreatorCreateComponent} from './component/meeting-creator/meeting-creator-create/meeting-creator-create.component';


@NgModule({
  declarations: [
    UserRolesComponent,
    MeetingCreatorListComponent,
    MeetingCreatorCreateComponent,
    MeetingAdminComponent
  ],
  entryComponents: [
    MeetingCreatorCreateComponent
  ],
  imports: [
    UserRolesRouting,
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
    DemoMaterialModule,
    ReactiveFormsModule,
    SharedModule
  ]
})

export class UserRolesModule {
}
