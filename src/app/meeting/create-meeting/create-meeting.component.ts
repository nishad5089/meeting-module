import {Component} from '@angular/core';
import {Meeting} from '../model/meeting';
import {MeetingSchedule} from '../model/meeting-schedule';
import {MeetingAttachment} from '../model/meeting-attachment';
import {MeetingInvitee} from '../model/meeting-invitee';
import {ActivatedRoute, Router} from '@angular/router';
import {MatSnackBar} from '@angular/material';
import {MeetingService} from '../service/meeting.service';
import {roles} from '../../constant/roles.constant';
import {info_message, warn_message} from '../../constant/messages';

@Component({
  selector: 'app-create',
  templateUrl: 'create-meeting.component.html',
})

export class CreateMeetingComponent {

  constructor(private meetingService: MeetingService, private router: Router,
              protected snackbar: MatSnackBar,
              protected route: ActivatedRoute) {
    this.selectedIndex = 1;
    this.isDraftValid = false;
    this.backgroundFilesToUpload = new Array<File>();
    this.backgroundAttachments = new Array<MeetingAttachment>();
    this.meetingAttachments = new Array<MeetingAttachment>();
    this.filesToUpload = new Array<File>();
  }

  meeting: Meeting = new Meeting();
  meetingSchedule: MeetingSchedule = new MeetingSchedule();
  filesToUpload: Array<File>;
  backgroundFilesToUpload: Array<File>;
  backgroundAttachments: Array<MeetingAttachment>;
  meetingAttachments: Array<MeetingAttachment>;
  selectedIndex: number;
  isMemNumberValid = false;
  isTitleValid = false;
  isDateValid = false;
  isStartTimeValid = false;
  isEndTimeValid = false;
  isRoomValid = false;
  isTypeValid = false;
  isAgendaValid = false;
  isKeyPersonnelValid = false;
  isChairpersonAndSecretarySame = false;

  isDraftValid: boolean;
  startTime: Date = new Date();
  endTime: Date = new Date();
  isLoadingResults = false;
  chairpersonType: string;
  chiefGuestType: string;
  chiefGuest: string;

  static setTime(date: Date, time: String): Date {
    let times;
    times = time.split(':');
    times[1] = times[1].split(' ');
    const setDate = new Date(date);
    setDate.setHours(parseInt(times[0], 10));
    setDate.setMinutes(parseInt(times[1][0], 10));
    if (times[1][1] === 'pm' && setDate.getHours() < 12) {
      setDate.setHours(parseInt(times[0], 10) + 12);
    }
    if (times[1][1] === 'am' && setDate.getHours() === 12) {
      setDate.setHours(0);
    }
    return setDate;
  }

  receiveBasicInfo(event) {
    this.meeting.meetingSchedule = new MeetingSchedule();

    this.meeting.memorandumNumber = event.controls['memorandumNo'].value;
    this.isMemNumberValid = this.meeting.memorandumNumber && this.meeting.memorandumNumber.length <= 255;

    this.meeting.meetingTitle = event.controls['meetingTitle'].value;
    // this.isDraftValid = !!this.meeting.meetingTitle;
    this.isTitleValid = !!this.meeting.meetingTitle;

    this.meeting.meetingTypeOid = event.controls['meetingType'].value;
    this.isTypeValid = !!this.meeting.meetingTypeOid;

    this.meeting.meetingSchedule.meetingDate = event.controls['date'].value;
    this.meeting.meetingSchedule.meetingRoomOid = event.controls['meetingRoom'].value;

    this.isDateValid = !!this.meeting.meetingSchedule.meetingDate;
    this.isRoomValid = !!this.meeting.meetingSchedule.meetingRoomOid;

    let times;
    times = event.controls['startTime'].value;
    if (times && event.controls['date'].value) {
      this.meeting.meetingSchedule.meetingStartTime =
        CreateMeetingComponent.setTime(event.controls['date'].value, times);
      this.isStartTimeValid = !!this.meeting.meetingSchedule.meetingStartTime;
    }
    times = event.controls['endTime'].value;
    if (times && event.controls['date'].value) {
      this.meeting.meetingSchedule.meetingEndTime =
        CreateMeetingComponent.setTime(event.controls['date'].value, times);
      this.isEndTimeValid = !!this.meeting.meetingSchedule.meetingEndTime;
    }
  }

  receiveAgenda(event) {
    this.meeting.agendas = event;
    this.isAgendaValid = this.meeting.agendas.length > 0;
  }

  receiveConflict(event: string) {
    if (event !== undefined) {
      this.meeting.hasConflict = event;
    } else {
      this.meeting.hasConflict = 'no';
    }
  }

  receiveBackground(event) {
    this.meeting.enothiReference = event.controls['eNothiReference'].value;
    this.meeting.meetingBackground = event.controls['background'].value;
  }

  receiveReferences(event) {
    this.meeting.previousMeetingReferences = event;
  }

  receiveKeypersonnel(event) {
    let val = event.controls['chairperson'].value;
    this.meeting.chairpersonOid = typeof val === 'object' ? val.oid : '';

    val = event.controls['signatory'].value;
    this.meeting.memberSecretaryOid = typeof val === 'object' ? val.oid : '';

    this.checkIsChairpersonAndSecretarySame();

    // this.chiefGuest = new MeetingInvitee();
    val = event.controls['chiefGuest'].value;
    this.chiefGuest = typeof val === 'object' ? val.oid : '';
    // this.chiefGuest = event.controls['chiefGuest'].value.empId;

    this.chairpersonType = event.controls['chairpersonType'].value;
    this.chiefGuestType = event.controls['chiefGuestType'].value;

    this.isKeyPersonnelValid = this.meeting.memberSecretaryOid !== '';
  }

  receiveAttachments(event) {
    this.meetingAttachments = event;
  }

  receiveFiles(event) {
    this.filesToUpload = event;
  }

  receiveBackgroundAttachments(event) {
    this.backgroundAttachments = event;
  }

  receiveBackgroundFiles(event) {
    this.backgroundFilesToUpload = event;
  }

  checkIsChairpersonAndSecretarySame() {
    if (this.meeting.memberSecretaryOid) {
      if (this.meeting.chairpersonOid) {
        if (this.meeting.chairpersonOid === this.meeting.memberSecretaryOid) {
          this.isChairpersonAndSecretarySame = true;
          this.snackbar.open(warn_message.SAME_CHAIRPERSON_MEMBER_SECRETARY)._dismissAfter(5000);
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

  checkValidity(): boolean {
    return this.isMemNumberValid && this.isTitleValid && this.isTypeValid &&
      this.isRoomValid && this.isDateValid && this.isAgendaValid && this.isKeyPersonnelValid
      && this.isStartTimeValid && this.isEndTimeValid;
  }

  saveMeeting() {
    if (this.checkValidity()) {
      if (this.isChairpersonAndSecretarySame) {
        this.snackbar.open(warn_message.SAME_CHAIRPERSON_MEMBER_SECRETARY)._dismissAfter(5000);
        return;
      }
      // this.meeting.officeOid = '';
      // this.meeting.meetingGroupOid = '';
      // this.meeting.projectOid = '';

      this.meeting.invitees = new Array<MeetingInvitee>();

      let serialNo = 1;

      if (this.meeting.chairpersonOid !== '') {
        const chairperson = MeetingInvitee.createInvitee(roles.MEM_CHAIRPERSON, serialNo++, this.meeting.chairpersonOid);
        chairperson.inviteeType = this.chairpersonType;
        this.meeting.invitees.push(chairperson);
      }

      const memberSecretary = MeetingInvitee.createInvitee(roles.MEM_MEMBER_SECRETARY, serialNo++, this.meeting.memberSecretaryOid);
      memberSecretary.inviteeType = 'internal';
      this.meeting.invitees.push(memberSecretary);

      if (this.chiefGuest !== '') {
        const chiefGuestInvitee = MeetingInvitee.createInvitee(roles.MEM_CHIEF_GUEST, serialNo++, this.chiefGuest);
        chiefGuestInvitee.inviteeType = this.chiefGuestType;
        this.meeting.invitees.push(chiefGuestInvitee);
      }

      const formData = new FormData();

      formData.append('meetingDto', JSON.stringify(this.meeting));

      Array.from(this.backgroundFilesToUpload.concat(this.filesToUpload)).forEach((file) => formData.append('file', file));
      Array.from(this.backgroundAttachments.concat(this.meetingAttachments)).forEach((attachment) => {
        formData.append('title', attachment.fileTitle);
        formData.append('description', attachment.description);
        formData.append('attachmentType', attachment.attachmentType);
      });

      this.isLoadingResults = true;
      this.meetingService.createWhole(formData).subscribe(response => {
        this.isLoadingResults = false;
        if (response.status !== 200) {
          this.snackbar.open(response.errors.general)._dismissAfter(3000);
          return;
        }

        this.snackbar.open(info_message.WAIT_FOR_MEETING_DETAILS)._dismissAfter(3000);
        this.meetingService.setDetailsTabIndex(2);
        this.router.navigate(['../../details/' + response.data.oid], {relativeTo: this.route});
      }, err => {
        this.isLoadingResults = false;
      }, () => {
        this.isLoadingResults = false;
      });
    }
  }

  nextTab() {
    this.selectedIndex++;
  }

  previousTab() {
    this.selectedIndex--;
  }

  receiveLoading(event: boolean) {
    this.isLoadingResults = event;
  }
}
