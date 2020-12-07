import {NgModule} from '@angular/core';
import {BuildingListComponent} from './building-list/building-list.component';
import {BuildingRouting} from './building.routing';
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
import {BuildingCreateComponent} from 'app/meeting/master-settings/building/building-create/building-create.component';
import {BuildingComponent} from './building.component';
import {DemoMaterialModule} from '../../../material.module';
import {SharedModule} from '../../../shared/shared.module';


@NgModule({
  declarations: [
    BuildingListComponent,
    BuildingCreateComponent,
    BuildingComponent
  ],
  entryComponents: [BuildingCreateComponent],
  imports: [
    BuildingRouting,
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
export class BuildingModule {
}
