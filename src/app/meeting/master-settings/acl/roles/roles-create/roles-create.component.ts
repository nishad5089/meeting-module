import {MasterAddComponent} from '../../../../core/master-add.component';
import {Roles} from '../model/roles';
import {Component, Inject} from '@angular/core';
import {DialogModel} from '../../../../core/master-list.component';
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef, MatSnackBar} from '@angular/material';
import {RolesService} from '../service/roles.service';

@Component({
  templateUrl: 'roles-create.component.html'
})

export class RolesCreateComponent extends MasterAddComponent<Roles> {
  constructor(
    public dialogRef: MatDialogRef<RolesCreateComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogModel<Roles>,
    protected service: RolesService,
    protected snackbar: MatSnackBar,
    protected dialog: MatDialog) {
    super(service, dialog, snackbar);
  }
}
