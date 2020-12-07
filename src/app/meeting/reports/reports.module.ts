import {NgModule} from '@angular/core';
import {ReportsComponent} from './reports.component';
import {ReportsRoutingModule} from './reports-routing.module';
import {DemoMaterialModule} from '../../material.module';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {CommonModule} from '@angular/common';

@NgModule({
  declarations: [
    ReportsComponent
  ],
  entryComponents: [
  ],
  imports: [
    ReportsRoutingModule,
    DemoMaterialModule,
    FormsModule,
    CommonModule,
    ReactiveFormsModule
  ],
  providers: [
  ]
})
export class ReportsModule {
}
