import {Component, Inject} from '@angular/core';
import {MasterAddComponent} from '../../../core/master-add.component';
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef, MatSnackBar} from '@angular/material';
import {BuildingService} from '../service/building.service';
import {Building} from '../model/building';
import {DialogModel} from '../../../core/master-list.component';

@Component({
  templateUrl: './building-create.component.html'
})
export class BuildingCreateComponent extends MasterAddComponent<Building> {

  constructor(
    public dialogRef: MatDialogRef<BuildingCreateComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogModel<Building>,
    protected service: BuildingService,
    protected snackbar: MatSnackBar,
    protected dialog: MatDialog) {
    super(service, dialog, snackbar);
  }

}
