import {MasterModel} from '../core/master.model';
import {MeetingSchedule} from './meeting-schedule';
import {MeetingAgenda} from './meeting-agenda';
import {MeetingAttachment} from './meeting-attachment';
import {MeetingInvitee} from './meeting-invitee';
import {MeetingRefererence} from './meeting-refererence';
import {MeetingRoom} from '../master-settings/meeting-room/model/meeting-room';

export class Meeting extends MasterModel {
  meetingTitle: string;
  meetingTypeOid: string;
  meetingGroupOid: string;
  memorandumNumber: string;
  meetingStatus: string;
  reason: string;
  statusObject: {label: string, tag: string, color: string};
  projectOid: string;
  meetingVisibility: string;
  enothiReference: string;
  meetingBackground: string;
  memberSecretaryOid: string;
  chairpersonOid: string;
  meetingSchedule: MeetingSchedule;
  agendas: Array<MeetingAgenda>;
  previousMeetingReferences: Array<MeetingRefererence>;
  attachments: Array<MeetingAttachment>;
  invitees: Array<MeetingInvitee>;
  searchField: string;
  hasConflict: string;
  resolutionMemorandumNumber: string;

  meetingRoom: MeetingRoom;

  setAutocomplete(value: string): void {
    this.searchField = value;
  }

}
