import {NgModule} from '@angular/core';
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
import {FormsModule} from '@angular/forms';
import {CommonModule} from '@angular/common';
import {ActionListComponent} from './action-list/action-list.component';
import {ActionCreateComponent} from './action-create/action-create.component';
import {ActionRoutingModule} from './action-routing.module';
import {DemoMaterialModule} from '../../../../material.module';
import {SharedModule} from '../../../../shared/shared.module';


@NgModule({
  declarations: [ActionListComponent, ActionCreateComponent],
  entryComponents: [ActionCreateComponent],
  imports: [
    ActionRoutingModule,
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
    SharedModule
  ]
})


export class ActionModule {

}
