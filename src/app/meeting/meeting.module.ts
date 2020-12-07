import {NgModule} from '@angular/core';
import {MeetingRoutingModule} from './meeting-routing.module';
import {FormsModule} from '@angular/forms';
import {CommonModule} from '@angular/common';
import {DemoMaterialModule} from '../material.module';

@NgModule({
  imports: [
    MeetingRoutingModule,
    FormsModule,
    CommonModule,
    FormsModule,
    DemoMaterialModule,
  ]
})

export class MeetingModule {
}
