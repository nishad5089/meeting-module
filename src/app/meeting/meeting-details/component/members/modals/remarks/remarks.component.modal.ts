import {Component, Inject} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';
import {MatSnackBar} from "@angular/material/snack-bar";

@Component({
  selector: 'app-remarks',
  templateUrl: './remarks.component.modal.html',
})

export class RemarksDialogComponent {

  constructor(
    public dialogRef: MatDialogRef<RemarksDialogComponent>,
    protected snackbar: MatSnackBar,
    @Inject(MAT_DIALOG_DATA) public data: string
  ) {
  }

  validateAndSave() {
    if (this.data === undefined
      || this.data.trim().length === 0) {
      this.snackbar.open('দয়া করে একটি মন্তব্য লিখুন')._dismissAfter(3000);
      return;
    }
    this.dialogRef.close(this.data);
  }

  closeModal() {
    this.dialogRef.close();
  }
}

