import {Component, Inject} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef, MatSnackBar} from '@angular/material';
import {MeetingAgenda} from '../../../../../../../app/meeting/model/meeting-agenda';
import {warn_message} from '../../../../../../constant/messages';

@Component({
  selector: 'app-agenda-dialog',
  templateUrl: 'add-agenda.modal.html'
})

export class AddAgendaModalComponent {
  str: string;
  constructor(
    public dialogRef: MatDialogRef<AddAgendaModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: MeetingAgenda,
    protected snackbar: MatSnackBar) {
    this.str = this.data.agenda;
  }

  closeModal() {
    this.dialogRef.close();
  }

  sendData() {
    if (this.str === undefined
      || this.str.trim().length === 0) {
      this.snackbar.open(warn_message.ADD_AGENDA)._dismissAfter(3000);
      return;
    }

    this.data.agenda = this.str;
    this.dialogRef.close(this.data);
  }
}
