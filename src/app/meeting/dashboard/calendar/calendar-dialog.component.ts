import {Component, Inject} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef, MatTableDataSource} from '@angular/material';
import {CalendarEvent} from 'calendar-utils';
import {addDays} from 'date-fns';
import {environment} from '../../../../environments/environment';
import {roles} from '../../../constant/roles.constant';
import {AuthenticationService} from '../../../shared/security/service/authentication.service';

@Component({
  selector: 'app-calendar-dialog',
  templateUrl: './calendar.component.modal.html',
  styleUrls: [
    './calendar.component.scss'
  ]
})
export class CalendarDialogComponent {
  public dataSource: MatTableDataSource<CalendarEvent>;
  displayColumns: Array<string>;

  constructor(
    public dialogRef: MatDialogRef<CalendarDialogComponent>,
    private authenticationService: AuthenticationService,
    @Inject(MAT_DIALOG_DATA) public data: { date: Date, events: Array<CalendarEvent> }) {
    this.dataSource = new MatTableDataSource(data.events);
    this.displayColumns = ['sl', 'title'];
    environment.IS_MODAL_OPEN = true;
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  goToDetails(oid: string) {
    this.dialogRef.close(oid);
  }

  isDateValid(): boolean {
    if ((this.data.date.getDate() === new Date().getDate() &&
      this.data.date.getMonth() === new Date().getMonth() && this.data.date.getFullYear() === new Date().getFullYear())) {
      return true;
    }
    return !(this.data.date.getTime() < new Date().getTime() ||
      this.data.date.getTime() > addDays(new Date(), 365).getTime());

  }


  isMeetingCreator(): boolean {
    return this.authenticationService.currentUserValue && this.authenticationService.currentUserValue.roles.includes(roles.MEM_MEETING_CREATOR);
  }

}
