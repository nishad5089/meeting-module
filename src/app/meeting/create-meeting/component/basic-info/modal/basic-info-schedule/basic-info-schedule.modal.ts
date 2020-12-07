import {Component, Inject} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef, MatTableDataSource} from '@angular/material';
import {Meeting} from '../../../../../../../app/meeting/model/meeting';

@Component({
  selector: 'app-schedule-dialog',
  templateUrl: 'basic-info-schedule.modal.html'
})

export class BasicInfoScheduleComponent {
  public dataSource: MatTableDataSource<Meeting>;
  displayColumns: Array<string>;

  constructor(
    public dialogRef: MatDialogRef<BasicInfoScheduleComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Array<Meeting>) {
    this.dataSource = new MatTableDataSource<Meeting>(data);
    this.displayColumns = ['serialNo', 'title', 'time'];
  }

  closeModal() {
    this.dialogRef.close();
  }
}
