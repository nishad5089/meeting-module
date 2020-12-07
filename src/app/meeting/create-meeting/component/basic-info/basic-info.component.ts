import {Component, EventEmitter, OnDestroy, OnInit, Output} from '@angular/core';
import {MeetingRoom} from '../../../master-settings/meeting-room/model/meeting-room';
import {MeetingType} from '../../../master-settings/meeting-type/model/meeting-type';
import {MeetingTypeService} from '../../../master-settings/meeting-type/service/meeting-type.service';
import {MAT_DATE_FORMATS, MatDialog, MatSnackBar} from '@angular/material';
import {Meeting} from '../../../model/meeting';
import {addYears} from 'date-fns';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {ScheduleService} from '../../../service/schedule.service';
import {MeetingService} from '../../../service/meeting.service';
import {MeetingSchedule} from '../../../model/meeting-schedule';
import {NgxMaterialTimepickerTheme} from 'ngx-material-timepicker';
import {CreateMeetingComponent} from '../../create-meeting.component';
import {warn_message} from '../../../../constant/messages';
import {DatePipe} from '@angular/common';
import {LocalNumberPipe} from '../../../../shared/pipes/locale-number.pipe';
// See the Moment.js docs for the meaning of these formats:
// https://momentjs.com/docs/#/displaying/format/
export const MY_FORMATS = {
  parse: {
    dateInput: 'LL',
  },
  display: {
    dateInput: 'LL',
    monthYearLabel: 'MMM YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'MMMM YYYY',
  },
};

@Component({
  selector: 'app-basic-info',
  templateUrl: './basic-info.component.html',
  styleUrls: ['./basic-info.component.css'],
  providers: [
    {provide: MAT_DATE_FORMATS, useValue: MY_FORMATS}
  ]
})
export class BasicInfoComponent implements OnInit, OnDestroy {

  constructor(private meetingTypeService: MeetingTypeService,
              public fb: FormBuilder,
              private meetingService: MeetingService,
              protected scheduleService: ScheduleService,
              public dialog: MatDialog,
              public snackbar: MatSnackBar) {
  }

  minDate = new Date();
  maxDate = addYears(new Date(), 1);
  @Output() formEvent = new EventEmitter<FormGroup>();
  @Output() conflictEvent = new EventEmitter<string>();
  @Output() loadingEvent = new EventEmitter<boolean>();
  meetingRoom: MeetingRoom;

  myForm: FormGroup;
  name: string;
  // time = {hour: 13, minute: 30};

  possibleConflictingMeetings: Array<Meeting> = [];

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

  static checkInRange(startTime: Date, endTime: Date, toBeChecked: Date): boolean {
    /*console.log(new Date(startTime) < new Date(toBeChecked) && new Date(endTime) > new Date(toBeChecked));
    console.log('start : ' + new Date(startTime));
    console.log('end : ' + new Date(endTime));
    console.log('check : ' + new Date(toBeChecked));*/
    return new Date(startTime) < new Date(toBeChecked) && new Date(endTime) > new Date(toBeChecked);
  }

  myFilter = (d: Date): boolean => {
    const day = d.getDay();
    // Prevent Saturday and Sunday from being selected.
    // return day !== 5 && day !== 6;
    return true;
  }

  ngOnInit() {
    this.reactiveForm();
    this.submitForm(true);
  }

  ngOnDestroy(): void {
    this.meetingService.setMeeting(null);
  }


  setMaxTime() {
    const formControl = this.myForm.controls['endTime'];
    if (formControl !== undefined
      && formControl.value !== undefined) {
      return formControl.value;
    }
  }

  setMinTime() {
    const formControl = this.myForm.controls['startTime'];
    if (formControl !== undefined
      && formControl.value !== undefined) {
      return formControl.value;
    }
  }

  setOtherTimePickerValue(thisTimePickerName, time: string) {
    if (thisTimePickerName === 'startTime') {
      if (this.myForm.controls['endTime'].value === null) {
        this.myForm.controls['endTime'].setValue(time);
      }
    } else {
      if (this.myForm.controls['startTime'].value === null) {
        this.myForm.controls['startTime'].setValue(time);
      }
    }
  }

  submitForm(value?: boolean) {

    this.formEvent.emit(this.myForm);
    if (!this.myForm.controls['date'].invalid && !this.myForm.controls['meetingRoom'].invalid) {
      if (value !== undefined) {
        this.getSchedule(this.myForm.controls['date'].value, this.myForm.controls['meetingRoom'].value);
      } else {
        this.conflictEvent.emit(this.checkConflicts());
      }
    }
  }

  reactiveForm() {
    this.myForm = this.fb.group({
      memorandumNo: ['', [Validators.required]],
      meetingTitle: ['', [Validators.required]],
      meetingType: ['', [Validators.required]],
      date: ['', [Validators.required]],
      startTime: [, [Validators.required]],
      endTime: [, [Validators.required]],
      meetingRoom: ['', [Validators.required]]
    });

    this.meetingService.meetingObs.subscribe(response => {
      if (response && response.meetingSchedule) {
        this.meetingRoom = new MeetingRoom();
        this.meetingRoom = response.meetingRoom;
        this.setMeetingRoom(response.meetingRoom);
        this.myForm.controls['date'].setValue(response.meetingSchedule.meetingDate);
        try {
          if (response.meetingSchedule.meetingStartTime === undefined) {
            response.meetingSchedule.meetingDate.setHours(9);
          }
          this.myForm.controls['startTime'].setValue(response.meetingSchedule.meetingDate.getHours() + ':' + response.meetingSchedule.meetingDate.getMinutes());
          this.myForm.controls['endTime'].setValue(response.meetingSchedule.meetingDate.getHours() + 1 + ':' + response.meetingSchedule.meetingDate.getMinutes());
        } catch (e) {
          // console.log(e);
        }
      }
    });
  }

  errorHandling(name: string, required: string) {
    return this.myForm.controls[name].hasError(required);
  }

  getSchedule(date: any, room: any) {
    const schedule = new MeetingSchedule();
    schedule.meetingRoomOid = room;
    schedule.meetingDate = date;
    this.loadingEvent.emit(true);
    this.scheduleService.getMeetings(schedule).subscribe(response => {
      this.loadingEvent.emit(false);
      const datePipe = new DatePipe('bn-BD');
      const localNumberPipe = new LocalNumberPipe();
      if (response.data.length > 0) {
        this.possibleConflictingMeetings = response.data;
        this.conflictEvent.emit(this.checkConflicts());
        // console.log(this.possibleConflictingMeetings);
        this.snackbar
          .open(localNumberPipe
            .transform(datePipe
              .transform(date, 'fullDate')) +
            warn_message.FOUND_CONFLICT_PART_1 + response.data.length + warn_message.FOUND_CONFLICT_PART_2)
          ._dismissAfter(3000);
      } else {
        this.possibleConflictingMeetings = [];
        this.conflictEvent.emit('no');
        this.snackbar.open(localNumberPipe
            .transform(datePipe
              .transform(date, 'fullDate')) +
          warn_message.FOUND_NO_CONFLICT)._dismissAfter(3000);
      }
    }, error1 => {
      this.loadingEvent.emit(false);
    }, () => {
      this.loadingEvent.emit(false);
    });
  }

  checkConflicts(): string {
    const startForm = this.myForm.controls['startTime'];
    const endForm = this.myForm.controls['endTime'];
    if ((startForm.value !== null && startForm.value !== undefined)
      && (endForm.value !== null && endForm.value !== undefined)) {
      const times1 = startForm.value;
      const startTime: Date = CreateMeetingComponent.setTime(this.myForm.controls['date'].value, times1);

      const times = endForm.value;
      const endTime: Date = CreateMeetingComponent.setTime(this.myForm.controls['date'].value, times);

      let conflict = 'no';
      this.possibleConflictingMeetings.forEach(meeting => {
          if ((BasicInfoComponent.checkInRange(startTime, endTime, meeting.meetingSchedule.meetingStartTime)
            || BasicInfoComponent.checkInRange(startTime, endTime, meeting.meetingSchedule.meetingEndTime)
            || BasicInfoComponent.checkInRange(meeting.meetingSchedule.meetingStartTime, meeting.meetingSchedule.meetingEndTime, startTime)
            || BasicInfoComponent.checkInRange(meeting.meetingSchedule.meetingStartTime, meeting.meetingSchedule.meetingEndTime, endTime)
            || ((new Date(meeting.meetingSchedule.meetingStartTime).getTime() === startTime.getTime())
              && (new Date(meeting.meetingSchedule.meetingEndTime).getTime() === endTime.getTime())))
            && meeting.meetingStatus === 'meeting_created') {
            conflict = 'yes';
          }
        }
      );
      return conflict;
    }
  }


  setMeetingRoom(room: MeetingRoom) {
    if (room === null) {
      this.myForm.controls['meetingRoom'].setValue(undefined);
      this.formEvent.emit(this.myForm);
      return;
    }
    this.myForm.controls['meetingRoom'].setValue(room.officeOid);
    this.submitForm(true);
  }

  setMeetingType(meetingType: MeetingType) {
    if (meetingType === null) {
      this.myForm.controls['meetingType'].setValue(undefined);
      this.formEvent.emit(this.myForm);
      return;
    }
    this.myForm.controls['meetingType'].setValue(meetingType.frequencyOid);
    this.formEvent.emit(this.myForm);
  }
}
