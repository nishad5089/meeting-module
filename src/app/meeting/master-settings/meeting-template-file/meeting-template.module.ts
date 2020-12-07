import {NgModule} from '@angular/core';
import {MatInputModule, MatNativeDateModule} from '@angular/material';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {HttpClientModule} from '@angular/common/http';
import {DemoMaterialModule} from '../../../material.module';
import {CommonModule} from '@angular/common';
import {MeetingTemplateListComponent} from './component/meeting-template-list/meeting-template-list.component';
import {MeetingTemplateRoutingModule} from './meeting-template-routing.module';
import {CreateTemplateComponent} from './component/create-template/create-template.component';
import {MeetingTemplateComponent} from './meeting-template.component';
import {SharedModule} from '../../../shared/shared.module';

@NgModule({
  declarations: [
    MeetingTemplateComponent,
    MeetingTemplateListComponent,
    CreateTemplateComponent
  ],
  imports: [
    MatInputModule,
    FormsModule,
    HttpClientModule,
    DemoMaterialModule,
    MatNativeDateModule,
    ReactiveFormsModule,
    CommonModule,
    MeetingTemplateRoutingModule,
    SharedModule
  ],
  entryComponents: [
    CreateTemplateComponent
  ],
  exports: [

  ]
})

export class MeetingTemplateModule {

}
