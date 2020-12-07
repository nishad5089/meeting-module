import {Meeting} from './meeting';
import {MeetingRoom} from '../master-settings/meeting-room/model/meeting-room';
import {MeetingType} from '../master-settings/meeting-type/model/meeting-type';
import {MeetingInvitee} from './meeting-invitee';
import {Employee} from './employee';
import {MeetingNote} from './meeting-note';
import {MeetingAgendaFollowup} from './meeting-agenda-followup';

export class MeetingDetails extends Meeting {
  templateOid: string;
  templateType: string;
  memberSecretary: MeetingInvitee;
  chairperson: MeetingInvitee;
  creator: Employee;
  meetingRoom: MeetingRoom;
  meetingType: MeetingType;
  taxStartDate: Date;
  taxEndDate: Date;
  notes: MeetingNote[];
  agendaFollowups: MeetingAgendaFollowup[];

  setBasicInfo(event: MeetingDetails) {
    this.oid = event.oid;
    this.memorandumNumber = event.memorandumNumber;
    this.agendas = event.agendas;
    if (event.chairperson !== undefined) {
      this.chairperson = event.chairperson;
    }
    this.chairpersonOid = event.chairpersonOid;
    this.memberSecretary = event.memberSecretary;
    this.memberSecretaryOid = event.memberSecretaryOid;
    this.createdBy = event.createdBy;
    this.meetingGroupOid = event.meetingGroupOid;
    this.meetingType = event.meetingType;
    this.meetingRoom = event.meetingRoom;
    this.meetingSchedule = event.meetingSchedule;
    this.meetingSchedule.meetingDate = new Date(event.meetingSchedule.meetingDate);
    this.meetingStatus = event.meetingStatus;
    this.meetingTitle = event.meetingTitle;
    this.meetingTypeOid = event.meetingTypeOid;
    this.meetingVisibility = event.meetingVisibility;
    this.status = event.status;
    this.officeOid = event.officeOid;
    this.projectOid = event.projectOid;
    this.creator = event.creator;
  }

  setBackground(event: MeetingDetails) {
    if (event.enothiReference !== undefined) {
      this.enothiReference = event.enothiReference;
    } else {
      this.enothiReference = '';
    }
    if (event.meetingBackground !== undefined) {
      this.meetingBackground = event.meetingBackground;
    } else {
      this.meetingBackground = '';
    }
    this.previousMeetingReferences = event.previousMeetingReferences;
  }
}

