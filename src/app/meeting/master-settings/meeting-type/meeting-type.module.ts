import {NgModule} from '@angular/core';
import {MatInputModule, MatNativeDateModule} from '@angular/material';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {HttpClientModule} from '@angular/common/http';
import {CommonModule} from '@angular/common';
import {MeetingTypeRoutingModule} from './meeting-type-routing.module';
import {FlexModule} from '@angular/flex-layout';
import {DemoMaterialModule} from '../../../material.module';
import {MeetingTypeListComponent} from './component/meeting-type-list/meeting-type-list.component';
import {MeetingTypeSaveComponent} from './component/meeting-type-save/meeting-type-save.component';
import {MeetingTypeComponent} from './meeting-type.component';
import {SharedModule} from "../../../shared/shared.module";

@NgModule({
  declarations: [
    MeetingTypeComponent,
    MeetingTypeListComponent,
    MeetingTypeSaveComponent
  ],
  imports: [
    MatInputModule,
    FormsModule,
    HttpClientModule,
    DemoMaterialModule,
    MatNativeDateModule,
    ReactiveFormsModule,
    CommonModule,
    MeetingTypeRoutingModule,
    FlexModule,
    SharedModule
  ],
  entryComponents: [
    MeetingTypeSaveComponent
  ]
})

export class MeetingTypeModule {
}
