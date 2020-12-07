import {NgModule} from '@angular/core';
import {CommonModule, DecimalPipe} from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {FlexModule} from '@angular/flex-layout';
import {DemoMaterialModule} from 'app/material.module';
import {GroupListComponent} from 'app/meeting/groups/component/group-list/group-list.component';
import {GroupDetailsComponent} from 'app/meeting/groups/component/group-details/group-details.component';
import {GroupsRoutingModule} from 'app/meeting/groups/groups-routing.module';
import {MemberManagementComponent} from 'app/shared/member-management/member-management.component';
import {SharedModule} from 'app/shared/shared.module';
import {GroupModalComponent} from 'app/meeting/groups/component/group-modal/group-modal.component';
import {ConfirmationComponent} from '../../shared/confirmation/confirmation.component';

@NgModule({
  declarations: [
    GroupListComponent,
    GroupDetailsComponent,
    GroupModalComponent
  ],
  entryComponents: [
    GroupModalComponent,
    MemberManagementComponent,
    ConfirmationComponent
  ],
  imports: [
    GroupsRoutingModule,
    CommonModule,
    DemoMaterialModule,
    FormsModule,
    ReactiveFormsModule,
    FlexModule,
    SharedModule
  ],
  exports: [],
  providers: [
    DecimalPipe
  ]
})
export class GroupsModule {
}
