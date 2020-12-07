import {Component, Inject, OnInit} from '@angular/core';
import {MeetingRoom} from '../../../master-settings/meeting-room/model/meeting-room';
import {MAT_DIALOG_DATA, MatDialogRef, MatSnackBar} from '@angular/material';
import {MeetingDetails} from '../../../model/meeting-details';
import {MeetingRoomService} from '../../../master-settings/meeting-room/service/meeting-room.service';
import {FormControl} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
import {MeetingService} from '../../../service/meeting.service';
import * as _ from 'lodash';
import {CreateMeetingComponent} from '../../../create-meeting/create-meeting.component';
import {environment} from '../../../../../environments/environment';
import {NgxMaterialTimepickerTheme} from 'ngx-material-timepicker';
import {MeetingSchedule} from '../../../model/meeting-schedule';
import {Meeting} from '../../../model/meeting';
import {ScheduleService} from '../../../service/schedule.service';
import {addYears} from 'date-fns';


@Component({
  selector: 'app-reschedule-meeting',
  templateUrl: './reschedule-meeting.modal.html'
})

// tslint:disable-next-line:component-class-suffix
export class RescheduleMeetingModal implements OnInit {

  copy: MeetingDetails;
  meetingRoom: MeetingRoom;
  meetingRooms: Array<MeetingRoom>;
  isLoadingResults = false;
  startTime: FormControl;
  endTime: FormControl;
  isConflicted = false;
  possibleConflictingMeetings: Array<Meeting> = [];

  minDate = new Date();
  maxDate = addYears(new Date(), 1);

  constructor(public dialogRef: MatDialogRef<RescheduleMeetingModal>,
              @Inject(MAT_DIALOG_DATA) public data: MeetingDetails,
              protected meetingRoomService: MeetingRoomService,
              protected snackbar: MatSnackBar,
              protected meetingService: MeetingService,
              protected router: Router,
              protected scheduleService: ScheduleService) {
    this.copy = _.cloneDeep(data);
    this.startTime = new FormControl(RescheduleMeetingModal.formatAMPM(data.meetingSchedule.meetingStartTime));
    this.endTime = new FormControl(RescheduleMeetingModal.formatAMPM(data.meetingSchedule.meetingEndTime));
    this.isLoadingResults = true;
    this.meetingRoomService.search(new MeetingRoom()).subscribe(res => {
      if (res.status !== 200) {
        this.snackbar.open(res.errors)._dismissAfter(3000);
        return;
      }
      this.meetingRooms = res.data.content;
    },
      error1 => {},
      () => {
        this.isLoadingResults = false;
      });
    environment.IS_MODAL_OPEN = true;
  }

  darkTheme: NgxMaterialTimepickerTheme = {
    container: {
      bodyBackgroundColor: '#424242',
      buttonColor: '#fff'
    },
    dial: {
      dialBackgroundColor: '#555',
    },
    clockFace: {
      clockFaceBackgroundColor: '#555',
      clockHandColor: '#9fbd90',
      clockFaceTimeInactiveColor: '#fff'
    }
  };

  static formatAMPM(date) {
    date = new Date(date);
    let hours = date.getHours();
    let minutes = date.getMinutes();
    const ampm = hours >= 12 ? 'pm' : 'am';
    hours = hours % 12;
    hours = hours ? hours : 12; // the hour '0' should be '12'
    minutes = minutes < 10 ? '0' + minutes : minutes;
    return hours + ':' + minutes + ' ' + ampm;
  }
  ngOnInit(): void {
    this.setMeetingRoomAutoComplete();
  }

  setMeetingRoomAutoComplete(): void {
    this.meetingRoom = this.copy.meetingRoom;
  }

  setMeetingRoom(room: MeetingRoom) {
    if (room === null) {
      this.copy.meetingSchedule.meetingRoomOid = undefined;
      return;
    }
    this.copy.meetingSchedule.meetingRoomOid = room.oid;
    this.checkConflict();
  }

  updateTime(type: string) {
    if (type === 'start') {
      this.copy.meetingSchedule.meetingStartTime =
        CreateMeetingComponent.setTime(new Date(this.copy.meetingSchedule.meetingDate), this.startTime.value);
    } else if (type === 'end') {
      this.copy.meetingSchedule.meetingEndTime =
        CreateMeetingComponent.setTime(new Date(this.copy.meetingSchedule.meetingDate), this.endTime.value);
    }
    this.checkConflict();
  }

  checkConflict(): void {
    this.formatTime();

    this.isConflicted = false;
    if (this.copy.meetingSchedule.meetingRoomOid !== undefined && this.copy.meetingSchedule.meetingDate !== undefined) {
      const schedule = new MeetingSchedule();
      schedule.meetingRoomOid = this.copy.meetingSchedule.meetingRoomOid;
      schedule.meetingDate = this.copy.meetingSchedule.meetingDate;
      this.scheduleService.getMeetings(schedule).subscribe(response => {
        if (response.data.length > 0) {
          this.possibleConflictingMeetings = response.data;
        } else {
          this.possibleConflictingMeetings = [];
        }

        if (this.possibleConflictingMeetings.length > 0) {
          const startTime: Date = this.copy.meetingSchedule.meetingStartTime;
          const endTime: Date = this.copy.meetingSchedule.meetingEndTime;

          if (startTime !== undefined && endTime !== undefined) {
            this.possibleConflictingMeetings.forEach(meeting => {
                if ((this.checkInRange(startTime, endTime, meeting.meetingSchedule.meetingStartTime)
                  || this.checkInRange(startTime, endTime, meeting.meetingSchedule.meetingEndTime)
                  || this.checkInRange(meeting.meetingSchedule.meetingStartTime, meeting.meetingSchedule.meetingEndTime, startTime)
                  || this.checkInRange(meeting.meetingSchedule.meetingStartTime, meeting.meetingSchedule.meetingEndTime, endTime)
                  || ((new Date(meeting.meetingSchedule.meetingStartTime).getTime() === startTime.getTime())
                    && (new Date(meeting.meetingSchedule.meetingEndTime).getTime() === endTime.getTime())))
                  && meeting.meetingStatus !== 'meeting_cancelled') {
                  if (this.copy.oid !== meeting.oid) {
                    this.isConflicted = true;
                    this.snackbar.open('রুম কনফ্লিক্ট বিদ্যমান, দয়া করে রুম অথবা সময়সূচী পরিবর্তন করুন')._dismissAfter(4000);
                    return;
                  }
                }
              }
            );
          }
        }
      });
    }
  }

  formatTime() {
    this.copy.meetingSchedule.meetingStartTime =
      CreateMeetingComponent.setTime(new Date(this.copy.meetingSchedule.meetingDate), this.startTime.value);
    this.copy.meetingSchedule.meetingEndTime =
      CreateMeetingComponent.setTime(new Date(this.copy.meetingSchedule.meetingDate), this.endTime.value);
  }

  checkInRange(startTime: Date, endTime: Date, toBeChecked: Date): boolean {
    return new Date(startTime) < new Date(toBeChecked) && new Date(endTime) > new Date(toBeChecked);
  }

  reSchedule() {
    if (!this.copy.meetingSchedule.meetingRoomOid) {
      this.snackbar.open('দ​য়া করে মিটিংয়ের কক্ষ বাছাই করুন')._dismissAfter(4000);
      return;
    }
    if (this.copy.reason === undefined || this.copy.reason === '') {
      this.snackbar.open('দ​য়া করে মিটিংয়ের সম​য়সূচী পুনর্নির্ধারণের কারণ লিখুন')._dismissAfter(4000);
      return;
    }
    this.meetingService.meetingReschedule(this.copy).subscribe( response => {
      if ( response.status !== 200 ) {
        this.snackbar.open(response.errors)._dismissAfter(3000);
        return;
      }
      this.meetingService.setDetailsTabIndex(1);
      // this.router.navigateByUrl('meetings/list', {skipLocationChange: true}).then(() =>
      //   this.router.navigateByUrl('meetings/details' + this.copy.oid, {relativeTo: this.route}));
      this.snackbar.open('মিটিং এর সময়সূচী পুনর্নির্ধারণ সফল হয়েছে')._dismissAfter(4000);
      location.reload();
    });
    this.dialogRef.close();
  }

  close() {
    this.dialogRef.close();
  }

}
