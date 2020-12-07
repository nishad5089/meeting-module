import {Component, Inject, OnInit} from '@angular/core';
import {MasterAddComponent} from '../../../core/master-add.component';
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef, MatSnackBar} from '@angular/material';
import {DialogModel} from '../../../core/master-list.component';
import {ExternalMeetingService} from '../../service/external-meeting.service';
import {ExternalMeeting} from '../../model/external-meeting';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {addYears} from 'date-fns';
import {NgxMaterialTimepickerTheme} from 'ngx-material-timepicker';

@Component({
  templateUrl: './external-meeting-create.component.html'
})
export class ExternalMeetingCreateComponent extends MasterAddComponent<ExternalMeeting> implements OnInit {

  constructor(
    public dialogRef: MatDialogRef<ExternalMeetingCreateComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogModel<ExternalMeeting>,
    public fb: FormBuilder,
    protected service: ExternalMeetingService,
    protected snackbar: MatSnackBar,
    protected dialog: MatDialog) {
    super(service, dialog, snackbar);
  }

  myForm: FormGroup;
  minDate = new Date();
  maxDate = addYears(new Date(), 1);

  isMeetingTitleValid = false;
  isMeetingDateValid = false;

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

  ngOnInit(): void {
    this.reactiveForm();
  }

  reactiveForm() {
    this.dto = new ExternalMeeting();
    this.myForm = this.fb.group({
      memorandumNo: [this.data.dto.meetingReference],
      meetingTitle: [this.data.dto.meetingTitle, [Validators.required]],
      meetingType: [this.data.dto.meetingType],
      meetingChairperson: [this.data.dto.meetingChairperson],
      date: [(this.data.dto.meetingDate ? new Date(this.data.dto.meetingDate) : ''), [Validators.required]],
      startTime: [],
      endTime: [],
      meetingRoom: [this.data.dto.meetingRoom]
    });

    if (this.data.dto.startTime) {
      this.myForm.controls['startTime'].setValue(new Date(this.data.dto.startTime));
    }
    if (this.data.dto.endTime) {
      this.myForm.controls['endTime'].setValue(new Date(this.data.dto.endTime));
    }
    this.submitForm();
  }

  errorHandling(name: string, required: string) {
    return this.myForm.controls[name].hasError(required);
  }

  submitForm() {
    this.isMeetingTitleValid = !!this.myForm.controls['meetingTitle'].value;
    this.isMeetingDateValid = !!this.myForm.controls['date'].value;
  }

  checkValidity(): boolean {
    return (this.isMeetingTitleValid && this.isMeetingDateValid);
  }

  save() {
    this.data.dto.meetingReference = this.myForm.controls['memorandumNo'].value;
    this.data.dto.meetingTitle = this.myForm.controls['meetingTitle'].value;
    this.data.dto.meetingChairperson = this.myForm.controls['meetingChairperson'].value;
    this.data.dto.meetingRoom = this.myForm.controls['meetingRoom'].value;
    this.data.dto.meetingType = this.myForm.controls['meetingType'].value;
    this.data.dto.meetingTitle = this.myForm.controls['meetingTitle'].value;
    this.data.dto.meetingDate = this.myForm.controls['date'].value;
    if (this.formatAndSetTime('startTime') !== undefined) {
      this.data.dto.startTime = this.formatAndSetTime('startTime');
    }
    if (this.formatAndSetTime('endTime') !== undefined) {
      this.data.dto.endTime = this.formatAndSetTime('endTime');
    }
    this.dialogRef.close(this.data.dto);
  }

  formatAndSetTime(type: string): Date {
    let times;
    if (this.myForm.controls[type].value === undefined || this.myForm.controls[type].value === null) {
      return;
    }
    times = this.myForm.controls[type].value.split(':');
    times[1] = times[1].split(' ');
    const date = new Date(this.myForm.controls['date'].value);
    date.setHours(parseInt(times[0], 10));
    date.setMinutes(parseInt(times[1][0], 10));
    // console.log(this.dto.startTime);
    if (times[1][1] === 'pm') {
      date.setHours((parseInt(times[0], 10) + 12) % 24);
    }
    if (times[1][1] === 'am' && date.getHours() === 12) {
      date.setHours(0);
    }
    return date;
  }

  cancel() {
    this.dialogRef.close();
  }
}
