import {MasterAddComponent} from '../../../../core/master-add.component';
import {MeetingStatus} from '../model/meeting-status';
import {Component, Inject} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef, MatSnackBar} from '@angular/material';
import {DialogModel} from '../../../../core/master-list.component';
import {MeetingStatusService} from '../service/meeting-status.service';

@Component({
  templateUrl: 'meeting-status.create.component.html'
})

export class MeetingStatusCreateComponent extends MasterAddComponent<MeetingStatus> {
  constructor(
    public dialogRef: MatDialogRef<MeetingStatusCreateComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogModel<MeetingStatus>,
    protected service: MeetingStatusService,
    protected snackbar: MatSnackBar,
    protected dialog: MatDialog) {
    super(service, dialog, snackbar);
  }
}
