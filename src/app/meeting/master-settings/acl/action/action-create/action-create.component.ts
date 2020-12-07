import {MasterAddComponent} from '../../../../core/master-add.component';
import {Action} from '../model/action';
import {Component, Inject} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef, MatSnackBar} from '@angular/material';
import {DialogModel} from '../../../../core/master-list.component';
import {ActionService} from '../service/action.service';

@Component({
  templateUrl: 'action-create.component.html'
})

export class ActionCreateComponent extends MasterAddComponent<Action> {
  constructor(
    public dialogRef: MatDialogRef<ActionCreateComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogModel<Action>,
    protected service: ActionService,
    protected snackbar: MatSnackBar,
    protected dialog: MatDialog) {
    super(service, dialog, snackbar);
  }
}
