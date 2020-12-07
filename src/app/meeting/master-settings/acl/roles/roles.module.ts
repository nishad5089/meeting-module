import {RolesListComponent} from './roles-list/roles-list.component';
import {RolesCreateComponent} from './roles-create/roles-create.component';
import {RolesRoutingModule} from './roles-routing.module';
import {
  MatCardModule, MatDialogModule, MatIconModule,
  MatInputModule,
  MatPaginatorModule,
  MatProgressSpinnerModule, MatSelectModule, MatSortModule,
  MatTableModule,
  MatTooltipModule
} from '@angular/material';
import {FormsModule} from '@angular/forms';
import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import {DemoMaterialModule} from '../../../../material.module';
import {SharedModule} from '../../../../shared/shared.module';


@NgModule({
  declarations: [RolesListComponent, RolesCreateComponent],
  entryComponents: [RolesCreateComponent],
  imports: [
    RolesRoutingModule,
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
    MatSelectModule,
    DemoMaterialModule,
    SharedModule
  ]
})

export class RolesModule {

}
