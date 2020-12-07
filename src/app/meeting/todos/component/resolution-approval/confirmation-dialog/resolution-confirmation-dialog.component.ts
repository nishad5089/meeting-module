import {Component, Inject} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';
import {FormControl, Validators} from '@angular/forms';

@Component({
  selector: 'app-resolution-confirmation-dialog',
  templateUrl: './resolution-confirmation-dialog.component.html',
  styleUrls: [
    './resolution-confirmation-dialog.component.css'
  ]
})

export class ResolutionConfirmationDialogComponent {
  commentControl = new FormControl('', [Validators.required]);
  constructor(public dialogRef: MatDialogRef<ResolutionConfirmationDialogComponent>,
              @Inject(MAT_DIALOG_DATA) public data: {value: string, meetingName: string}) {
  }

  onNoClick() {
    this.dialogRef.close();
  }

  sendData(): any {
    if (this.data.value !== 'approve') {
      return {value: this.data.value, comment: this.commentControl.value};
    } else {
      return {value: this.data.value,
        comment: this.commentControl.value !== undefined ? this.commentControl.value : ''};
    }
  }
}
