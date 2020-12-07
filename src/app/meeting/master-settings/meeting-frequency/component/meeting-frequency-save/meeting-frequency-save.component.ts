import {Component, Inject} from '@angular/core';
import {MasterAddComponent} from '../../../../core/master-add.component';
import {MeetingFrequency} from '../../model/meeting-frequency';
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef, MatSnackBar} from '@angular/material';
import {DialogModel} from '../../../../core/master-list.component';
import {MeetingFrequencyService} from '../../service/meeting-frequency.service';

@Component({
  templateUrl: './meeting-frequency-save.component.html',
})
export class MeetingFrequencySaveComponent extends MasterAddComponent<MeetingFrequency> {

  constructor(
    public dialogRef: MatDialogRef<MeetingFrequencySaveComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogModel<MeetingFrequency>,
    protected service: MeetingFrequencyService,
    protected snackbar: MatSnackBar,
    protected dialog: MatDialog) {
    super(service, dialog, snackbar);
  }

}
