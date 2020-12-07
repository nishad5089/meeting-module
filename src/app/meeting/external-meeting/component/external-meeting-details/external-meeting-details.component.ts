import {Component, Inject} from '@angular/core';
import {MasterAddComponent} from '../../../core/master-add.component';
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef, MatSnackBar} from '@angular/material';
import {ExternalMeeting} from '../../model/external-meeting';
import {ExternalMeetingService} from '../../service/external-meeting.service';

@Component({
  templateUrl: './external-meeting-details.component.html'
})
export class ExternalMeetingDetailsComponent extends MasterAddComponent<ExternalMeeting> {

  constructor(
    public dialogRef: MatDialogRef<ExternalMeetingDetailsComponent>,
    @Inject(MAT_DIALOG_DATA) public data: ExternalMeeting,
    protected service: ExternalMeetingService,
    protected snackbar: MatSnackBar,
    protected dialog: MatDialog) {
    super(service, dialog, snackbar);
  }

  cancel() {
    this.dialogRef.close();
  }
}
