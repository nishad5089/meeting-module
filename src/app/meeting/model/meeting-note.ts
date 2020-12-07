import {MasterModel} from '../core/master.model';
import {MeetingAgenda} from './meeting-agenda';
import {MeetingInvitee} from './meeting-invitee';

export class MeetingNote extends MasterModel {
  speaker: string;
  note: string;
  agendaOid: string;
  agenda: MeetingAgenda;
  spreakerEmployee: MeetingInvitee;
}
