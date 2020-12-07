import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';
import {Group} from '../../../../../groups/model/group';
import {MatSnackBar} from "@angular/material/snack-bar";

@Component({
  templateUrl: './group-dialog.component.html',
})
export class GroupDialogComponent {

  constructor(
    public dialogRef: MatDialogRef<GroupDialogComponent>,
    protected snackbar: MatSnackBar,
    @Inject(MAT_DIALOG_DATA) public data: Group) {
  }

  validateAndSave() {
    if (this.data.groupName === undefined
      || this.data.groupName.trim().length === 0) {
      this.snackbar.open('দয়া করে গ্রুপের নাম লিখুন')._dismissAfter(3000);
      return;
    }
    this.dialogRef.close(this.data);
  }

  closeModal() {
    this.dialogRef.close();
  }

}
