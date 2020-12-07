import {ChangeDetectionStrategy, Component, OnInit, ViewEncapsulation} from '@angular/core';
import {CalendarEvent, CalendarEventAction, CalendarView} from 'angular-calendar';
import {Meeting} from '../../model/meeting';
import {isSameDay, isSameMonth} from 'date-fns';
import {Subject} from 'rxjs';
import {MatDialog, MatSnackBar} from '@angular/material';
import {ActivatedRoute, Router} from '@angular/router';
import {MasterComponent} from '../../core/master.component';
import {MeetingService} from '../../service/meeting.service';
import {MeetingRoom} from '../../master-settings/meeting-room/model/meeting-room';
import {MeetingSchedule} from '../../model/meeting-schedule';
import {CalendarDialogComponent as dialogComponent} from './calendar-dialog.component';
import {environment} from '../../../../environments/environment';
import {roles} from '../../../constant/roles.constant';
import {AuthenticationService} from '../../../shared/security/service/authentication.service';

// https://mattlewis92.github.io/angular-calendar/#/kitchen-sink
@Component({
  selector: 'app-calender',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class CalendarComponent extends MasterComponent<Meeting> implements OnInit {

  dto: Meeting = new Meeting();

  showFilters = false;
  view: CalendarView = CalendarView.Month;
  activeDayIsOpen = false;
  CalendarView = CalendarView;
  viewDate: Date = new Date();
  events: CalendarEvent[] = [];
  meetings: Array<Meeting>;
  refresh: Subject<any> = new Subject();


  actions: CalendarEventAction[] = [];
  loading: boolean;

  constructor(protected meetingService: MeetingService,
              public dialog: MatDialog,
              private authenticationService: AuthenticationService,
              protected router: Router,
              protected snackbar: MatSnackBar,
              protected route: ActivatedRoute) {
    super(meetingService, dialog, snackbar);
    this.dto.meetingSchedule = new MeetingSchedule();
    this.search(this.dto);
  }

  reset() {
    // ToDo can we change it?
  }

  setFilter() {

  }

  setTableDetails() {
    this.dto = new Meeting();
    this.dto.meetingSchedule = new MeetingSchedule();
  }

  getStartDate() {
    let month = this.viewDate.getMonth();
    let date = 1;
    if (this.viewDate.getDay() !== 0) {
      month--;
      date = this.getEndDateByMonth(month, this.viewDate.getFullYear()) - this.viewDate.getDay() + 1;
    }
    return new Date(this.viewDate.getFullYear(), month, date);
  }

  getEndDateByMonth(month: number, year: number): number {
    let endDate = 30;
    month++;
    switch (month) {
      case 1:
      case 3:
      case 5:
      case 7:
      case 8:
      case 10:
      case 12:
        endDate = 31;
        break;
      case 2:
        endDate = 28;
        if (this.isLeapYear(year)) {
          endDate = 29;
        }
        break;
    }
    return endDate;
  }

  isLeapYear(year: number) {
    let result = false;
    if (year / 400) {
      result = true;
    } else if (year / 100) {
      result = false;
    } else if (year / 4) {
      result = true;
    } else {
      result = false;
    }
    return result;
  }

  getEndDate() {
    return new Date(this.viewDate.getFullYear(), this.viewDate.getMonth(), this.getEndDateByMonth(this.viewDate.getMonth(), this.viewDate.getFullYear()));
  }

  search(dto: Meeting) {
    this.loading = true;
    this.dto.meetingSchedule.meetingStartTime = this.getStartDate();
    this.dto.meetingSchedule.meetingEndTime = this.getEndDate();
    this.meetingService.search(dto, 200, 0).subscribe(response => {
      this.loading = false;
      this.events = [];
      if (response.data === undefined || response.data.content === undefined || response.data.content.length === 0) {
        return;
      }
      this.meetings = response.data.content;
      for (let i = 0; i < this.meetings.length; i++) {
        const meetingDate = new Date(this.meetings[i].meetingSchedule.meetingDate);
        const meetingStartTime = new Date(this.meetings[i].meetingSchedule.meetingStartTime);
        const meetingEndTime = new Date(this.meetings[i].meetingSchedule.meetingEndTime);
        const mst = meetingDate.setHours(meetingStartTime.getHours(), meetingStartTime.getMinutes());
        const met = meetingDate.setHours(meetingEndTime.getHours(), meetingEndTime.getMinutes());
        const newEvent: CalendarEvent = {
          id: this.meetings[i].oid,
          start: new Date(mst),
          end: new Date(met),
          title: this.meetings[i].meetingTitle,
          color: {
            primary: '#ad2121',
            secondary: '#FAE3E3'
          },
          actions: this.actions,
          allDay: false,
          resizable: {
            beforeStart: true,
            afterEnd: true
          },
          draggable: false
        };
        this.events.push(newEvent);
        this.refresh.next();
      }
    }, error => {
      this.refresh.next();
      // console.log(error);
      this.loading = false;
    }, () => {
      this.loading = false;
      this.refresh.next();
    });
  }

  ngOnInit() {
  }

  setView(view: CalendarView) {
    this.view = view;
  }

  closeOpenMonthViewDay(changeMonth = 0) {
    this.viewDate = new Date(this.viewDate.getFullYear(), this.viewDate.getMonth() + changeMonth, this.viewDate.getDate());
    this.activeDayIsOpen = false;
    this.search(this.dto);
  }

  handleEvent(action: string, event: CalendarEvent): void {
    this.loading = true;
    this.meetingService.setDetailsTabIndex(1);
    this.router.navigate(['../details/' + event.id.toString()], {relativeTo: this.route});
  }

  calendarClicked(date: Date, events: CalendarEvent[] = [], setStartTime: boolean = true): void {
    if (events === undefined || events.length === 0) {
      this.dto.meetingSchedule.meetingStartTime = undefined;
      if (setStartTime) {
        this.dto.meetingSchedule.meetingStartTime = date;
      }
      if (this.isMeetingCreator()) {
        this.goToCreateMeeting(date);
      } else {
        this.snackbar.open('দুঃখিত​, আপনার মিটিং তৈরি করার অনুমতি নেই')._dismissAfter(4000);
      }
      return;
    }
    events = events.filter(e => e.end.getDate() === date.getDate()
      && e.end.getMonth() === date.getMonth()
      && e.end.getFullYear() === date.getFullYear());
    if (isSameMonth(date, this.viewDate)) {
      if (
        (isSameDay(this.viewDate, date) && this.activeDayIsOpen === true) ||
        events.length === 0
      ) {
        this.activeDayIsOpen = false;
      } else {
        this.activeDayIsOpen = false;
      }
    }
    this.openDialog(date, events);
  }

  openDialog(date: Date, events: Array<CalendarEvent>): void {
    const dialogRef = this.dialog.open(dialogComponent, {
      data: {date: date, events: events}
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result !== undefined) {
        environment.IS_MODAL_OPEN = false;
        if (result instanceof Date) {
          this.goToCreateMeeting(result);
        } else {
          this.loading = true;
          this.meetingService.setDetailsTabIndex(1);
          this.router.navigate(['../details/' + result], {relativeTo: this.route});
        }
      }
    });
  }

  keyDownFunction(event) {
    if (event.key === 'Enter') {
      this.search(this.dto);
    }
  }

  receiveLoading(event: boolean) {
    this.loading = event;
  }

  goToCreateMeeting(date: Date) {
    const now = new Date();
    now.setDate(now.getDate() - 1);
    if (date < now) {
      this.snackbar.dismiss();
      this.snackbar.open('দুঃখিত, অতীত তারিখে মিটিং তৈরি করা সম্ভব নয়!')._dismissAfter(3000);
      return;
    }
    this.dto.meetingSchedule.meetingDate = date;
    this.meetingService.setMeeting(this.dto);
    this.router.navigate(['../create'], {relativeTo: this.route});
  }

  setMeetingRoom(room: MeetingRoom) {
    if (room === null ) {
      this.dto.meetingRoom = null;
      this.dto.meetingSchedule.meetingRoomOid = undefined;
      return;
    }
    this.dto.meetingRoom = room;
    this.dto.meetingSchedule.meetingRoomOid = room.buildingOid;
  }

  isMeetingCreator(): boolean {
    return this.authenticationService.currentUserValue && this.authenticationService.currentUserValue.roles.includes(roles.MEM_MEETING_CREATOR);
  }
}

