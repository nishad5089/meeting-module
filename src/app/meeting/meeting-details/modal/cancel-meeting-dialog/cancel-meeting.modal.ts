import {Component, Inject} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef, MatSnackBar} from '@angular/material';
import {MeetingDetails} from '../../../model/meeting-details';
import {Router} from '@angular/router';
import {MeetingService} from '../../../service/meeting.service';
import * as _ from 'lodash';
import {success_message} from '../../../../constant/messages';
import {environment} from '../../../../../environments/environment';

@Component({
  selector: 'app-cancel-meeting',
  templateUrl: './cancel-meeting.modal.html'
})

export class CancelMeetingModalComponent {
  meeting: MeetingDetails;
  constructor(public dialogRef: MatDialogRef<CancelMeetingModalComponent>,
              @Inject(MAT_DIALOG_DATA) public data: MeetingDetails,
              protected meetingService: MeetingService,
              protected snackbar: MatSnackBar,
              protected router: Router) {
    this.meeting = _.cloneDeep(data);
    environment.IS_MODAL_OPEN = true;
  }

  cancelMeeting() {
    this.meetingService.meetingCancel(this.meeting).subscribe( response => {
      if (response.status !== 200 ) {
        return;
      }
      this.snackbar.open(success_message.CANCEL_MEETING)._dismissAfter(4000);
      location.reload();
    });
  }

  closeModal() {
    this.dialogRef.close();
  }
}
