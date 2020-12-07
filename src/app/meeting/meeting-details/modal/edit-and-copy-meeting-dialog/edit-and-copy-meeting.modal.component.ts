import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef, MatSnackBar} from '@angular/material';
import {MeetingDetails} from '../../../../../app/meeting/model/meeting-details';
import {Meeting} from '../../../../../app/meeting/model/meeting';
import {MeetingRoom} from '../../../../../app/meeting/master-settings/meeting-room/model/meeting-room';
import {MeetingType} from '../../../../../app/meeting/master-settings/meeting-type/model/meeting-type';
import {MeetingTypeService} from '../../../../../app/meeting/master-settings/meeting-type/service/meeting-type.service';
import {FormControl} from '@angular/forms';
import {MeetingInvitee} from '../../../../../app/meeting/model/meeting-invitee';
import {AuthenticationService} from '../../../../../app/shared/security/service/authentication.service';
import {Router} from '@angular/router';
import {MeetingService} from '../../../../../app/meeting/service/meeting.service';
import {MeetingRefererence} from '../../../../../app/meeting/model/meeting-refererence';
import {roles} from '../../../../../app/constant/roles.constant';
import {Observable} from 'rxjs';
import {MemberAutocompleteService} from '../../../../../app/shared/service/member-autocomplete.service';
import {attendee_type} from '../../../../constant/attendee-type';
import * as _ from 'lodash';
import {MeetingSchedule} from '../../../model/meeting-schedule';
import {ScheduleService} from '../../../service/schedule.service';
import {NgxMaterialTimepickerTheme} from 'ngx-material-timepicker';
import {CreateMeetingComponent} from '../../../create-meeting/create-meeting.component';
import {addYears} from 'date-fns';
import {RescheduleMeetingModal} from '../reschedule-meeting-dialog/reschedule-meeting.modal';
import {environment} from '../../../../../environments/environment';

@Component({
  templateUrl: './edit-and-copy-meeting.modal.html',
})

export class EditAndCopyMeetingModalComponent implements OnInit {

  copy: MeetingDetails = new MeetingDetails();
  possibleConflictingMeetings: Array<Meeting> = [];
  meetingType: MeetingType;
  meetingRoom: MeetingRoom;
  startTime: FormControl;
  endTime: FormControl;
  isLoadingResults = false;
  chairperson: FormControl;
  secretary: FormControl;

  isMemNumberValid = false;
  isTitleValid = false;
  isDateValid = false;
  isRoomValid = false;
  isTypeValid = false;
  isAgendaValid = false;
  isKeyPersonnelValid = false;

  isConflicted = false;
  isChairpersonAndSecretarySame = false;

  radioButtonSelection = '';
  options = [{value: attendee_type.EMPLOYEE, label: 'কর্মকর্তা/কর্মচারী'}, {value: attendee_type.GUEST, label: 'অতিথি'}];

  filteredChairperson$: Observable<any> = null;
  filteredMemberSecretary$: Observable<any> = null;

  minDate = new Date();
  maxDate = addYears(new Date(), 1);

  constructor(public dialogRef: MatDialogRef<EditAndCopyMeetingModalComponent>,
              @Inject(MAT_DIALOG_DATA) public data: { type: string, meeting: MeetingDetails },
              protected meetingService: MeetingService,
              protected scheduleService: ScheduleService,
              protected snackbar: MatSnackBar,
              protected authenticationService: AuthenticationService,
              protected router: Router,
              protected autoCompleteService: MemberAutocompleteService) {
    this.copy = _.cloneDeep(data.meeting);
    this.startTime = new FormControl(RescheduleMeetingModal.formatAMPM(data.meeting.meetingSchedule.meetingStartTime));
    this.endTime = new FormControl(RescheduleMeetingModal.formatAMPM(data.meeting.meetingSchedule.meetingEndTime));
    this.radioButtonSelection = this.copy.chairperson ? this.copy.chairperson.inviteeType : 'internal';
    this.isLoadingResults = true;
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

  getPreviousReferenceMeetings(): Meeting[] {
    return this.copy.previousMeetingReferences.map(ref => ref.meeting);
  }

  setMeetingRoomAutoComplete(): void {
    this.meetingRoom = this.copy.meetingRoom;
  }

  setMeetingTypeAutocomplete(): void {
    this.meetingType = this.copy.meetingType;
  }

  setMeetingType(type: MeetingType) {
    if (type === null) {
      this.copy.meetingTypeOid = undefined;
      return;
    }
    this.copy.meetingTypeOid = type.oid;
    this.isLoadingResults = false;
  }

  setMeetingRoom(room: MeetingRoom) {
    if (room === null) {
      this.copy.meetingSchedule.meetingRoomOid = undefined;
      return;
    }
    this.copy.meetingSchedule.meetingRoomOid = room.oid;
    this.checkConflict();
  }

  setPreviousMeetingReference(event: Meeting[]): void {
    this.copy.previousMeetingReferences.forEach(x => {
      x.status = 'delete';
    });
    event.forEach(ref => {
      const newRef = new MeetingRefererence(ref.oid, this.copy.oid);
      this.copy.previousMeetingReferences.push(newRef);
    });
  }

  setChairperson(): void {
    this.chairperson = new FormControl(this.copy.chairperson ? this.copy.chairperson.employee : {});
    this.chairperson.valueChanges.subscribe(x => {
      if (typeof x === 'object') {
        this.copy.chairpersonOid = x.oid;
        this.checkIsChairpersonAndSecretarySame();
        return;
      }
      this.copy.chairpersonOid = '';
      this.checkIsChairpersonAndSecretarySame();
      // ToDo if no data found for x clear input
      this.filteredChairperson$ = this.autoCompleteService.lookup(this.radioButtonSelection, x, roles.MEM_CHAIRPERSON);
    });
  }

  setSecretary(): void {
    this.secretary = new FormControl(this.copy.memberSecretary ? this.copy.memberSecretary.employee : {});
    this.secretary.valueChanges.subscribe(x => {
      if (typeof x !== 'string') {
        this.copy.memberSecretaryOid = x.oid;
        this.checkIsChairpersonAndSecretarySame();
        return;
      }
      this.copy.memberSecretaryOid = '';
      this.checkIsChairpersonAndSecretarySame();
      // ToDo if no data found for x clear input
      this.filteredMemberSecretary$ = this.autoCompleteService.lookup(attendee_type.EMPLOYEE, x, roles.MEM_MEMBER_SECRETARY);
    });
  }

  ngOnInit(): void {
    this.setChairperson();
    this.setSecretary();
    this.setMeetingRoomAutoComplete();
    this.setMeetingTypeAutocomplete();
  }

  displayFn(element?): string {
    if (element) {
      let name = element.name;
      if (element.designationName && element.designationName.length > 0) {
        name += ', ' + element.designationName;
      }
      if (element.departmentName && element.departmentName.length > 0) {
        name += ', ' + element.departmentName;
      }
      if (element.orgName && element.orgName.length > 0) {
        name += ', ' + element.orgName;
      }
      return name;
    }
  }

  checkIsChairpersonAndSecretarySame() {
    if (this.copy.memberSecretaryOid) {
      if (this.copy.chairpersonOid) {
        if (this.copy.chairpersonOid === this.copy.memberSecretaryOid) {
          this.isChairpersonAndSecretarySame = true;
          this.snackbar.open('চেয়ারপারসন এবং মেম্বার সেক্রেটারি একই ব্যাক্তি হতে পারবেন না। দয়া করে পরিবর্তন করুন')._dismissAfter(5000);
          return;
        } else {
          this.isChairpersonAndSecretarySame = false;
        }
      } else {
        this.isChairpersonAndSecretarySame = false;
      }
    } else {
      this.isChairpersonAndSecretarySame = false;
    }
  }

  updateValidationParameters() {
    this.isMemNumberValid = !!this.copy.memorandumNumber;
    this.isTitleValid = !!this.copy.meetingTitle;
    this.isTypeValid = !!this.copy.meetingTypeOid;
    this.isRoomValid = !!this.copy.meetingSchedule.meetingRoomOid;
    this.isDateValid = !!this.copy.meetingSchedule.meetingDate;
    this.isKeyPersonnelValid = this.copy.memberSecretaryOid !== '';
    this.isAgendaValid = this.copy.agendas.length !== 0;
  }

  checkValidity(): boolean {
    return this.isMemNumberValid && this.isTitleValid && this.isTypeValid &&
      this.isRoomValid && this.isDateValid && this.isAgendaValid && this.isKeyPersonnelValid;
  }

  isValid(): boolean {
    this.updateValidationParameters();
    return this.checkValidity();
  }

  close() {
    this.dialogRef.close();
  }

  save() {
    if (this.isChairpersonAndSecretarySame) {
      this.snackbar.open('চেয়ারপারসন এবং মেম্বার সেক্রেটারি একই ব্যাক্তি হতে পারবেন না। দয়া করে পরিবর্তন করুন')._dismissAfter(5000);
      return;
    }
    if (this.isValid() === false) {
      this.snackbar.open('দয়া করে আবশ্যক ফিল্ডগুলো পূরণ করুন')._dismissAfter(4000);
      return;
    }
    this.setXRoleMember(roles.MEM_MEMBER_SECRETARY, this.copy.memberSecretaryOid, attendee_type.EMPLOYEE);
    this.checkChairperson();
    if (this.data.type === 'edit') {
      this.meetingService.meetingEdit(this.copy).subscribe(response => {
        this.successHandler(response, 'মিটিং এডিট সফল হয়েছে');
      }, error => this.errorHandler(error));
    } else if (this.data.type === 'copy') {
      this.meetingService.meetingCopy(this.copy).subscribe(response => {
        this.successHandler(response, 'মিটিং টি সফলভাবে কপি করা হয়েছে');
      }, error => this.errorHandler(error));
    }
  }

  checkConflict(): void {
    this.formatTime();

    // let conflict = 'no';
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
                  if (this.data.type === 'edit') {
                    if (this.copy.oid !== meeting.oid) {
                      this.isConflicted = true;
                      this.snackbar.open('রুম কনফ্লিক্ট বিদ্যমান, দয়া করে রুম অথবা সময়সূচী পরিবর্তন করুন')._dismissAfter(4000);
                      return;
                    }
                  } else if (this.data.type === 'copy') {
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

  errorHandler(error) {
    this.snackbar.open(error)._dismissAfter(3000);
  }

  successHandler(response: {}, msg: string) {
    if (response['status'] !== 200) {
      this.snackbar.open(response['errors'])._dismissAfter(3000);
      return;
    }
    // ToDo osthir niloy
    // this.router.navigateByUrl('meetings/list', {skipLocationChange: true}).then(() =>
    //   this.router.navigateByUrl('meetings/details/' + this.copy.oid, {relativeTo: this.route})
    // );
    this.snackbar.open(msg)._dismissAfter(4000);
    this.dialogRef.close(response['data']);
  }

  updateTime(type: string) {
    // Todo will be refactored by Niloy and Sadik
    let times;
    if (type === 'start') {
      times = this.startTime.value.split(':');
      times[1] = times[1].split(' ');
      this.copy.meetingSchedule.meetingStartTime = new Date(this.copy.meetingSchedule.meetingDate);
      this.copy.meetingSchedule.meetingStartTime.setHours(parseInt(times[0], 10));
      this.copy.meetingSchedule.meetingStartTime.setMinutes(parseInt(times[1][0], 10));
      // console.log(this.meeting.meetingSchedule.meetingStartTime);
      if (times[1][1] === 'pm') {
        this.copy.meetingSchedule.meetingStartTime.setHours((parseInt(times[0], 10) + 12) % 24);
      }
    } else if (type === 'end') {
      times = this.endTime.value.split(':');
      times[1] = times[1].split(' ');
      this.copy.meetingSchedule.meetingEndTime = new Date(this.copy.meetingSchedule.meetingDate);
      this.copy.meetingSchedule.meetingEndTime.setHours(parseInt(times[0], 10));
      this.copy.meetingSchedule.meetingEndTime.setMinutes(parseInt(times[1][0], 10));
      // console.log(this.meeting.meetingSchedule.meetingStartTime);
      if (times[1][1] === 'pm') {
        this.copy.meetingSchedule.meetingEndTime.setHours((parseInt(times[0], 10) + 12) % 24);
      }
    }
    this.checkConflict();
  }

  private setXRoleMember(ownershipStatus: string, memberOid: string, inviteeType: string) {
    let isFound = false;
    for (const x of this.copy.invitees) {
      if (memberOid === x.memberOid) {
        if (x.ownershipStatus !== ownershipStatus) {
          this.setXAsMember(ownershipStatus);
          x.ownershipStatus = ownershipStatus;
        }
        isFound = true;
        break;
      }
    }
    if (isFound === false) {
      this.setNewXRole(ownershipStatus, memberOid, inviteeType);
    }
  }

  private setXAsMember(ownershipStatus: string): void {
    if (this.copy.chairperson === undefined && ownershipStatus === roles.MEM_CHAIRPERSON) {
      return;
    }
    this.copy.invitees.filter(invitee2 => invitee2.ownershipStatus === ownershipStatus)[0].ownershipStatus =
      roles.MEM_MEETING_MEMBER;
  }

  private setNewXRole(ownershipStatus: string, memberOid: string, inviteeType: string) {
    this.setXAsMember(ownershipStatus);
    const invitee = MeetingInvitee.createNewInvitee({
      meetingOid: this.copy.oid,
      inviteeType: inviteeType,
      memberOid: memberOid,
      serialNo: this.copy.invitees.length + 1,
      ownershipStatus: ownershipStatus,
      createdBy: this.authenticationService.currentUserValue.employeeOfficeId
    });
    this.copy.invitees.push(invitee);
  }

  private checkChairperson() {
    if (this.copy.chairpersonOid) {
      this.setXRoleMember(roles.MEM_CHAIRPERSON, this.copy.chairpersonOid, this.radioButtonSelection);
    } else {
      this.setXAsMember(roles.MEM_CHAIRPERSON); // this statement must have to be executed before undefining chairperson
      this.copy.chairpersonOid = undefined;
      this.copy.chairperson = undefined;
    }
  }
}

