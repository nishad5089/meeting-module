import {MasterModel} from '../../core/master.model';
import {MeetingInvitee} from '../../model/meeting-invitee';

export class Group extends MasterModel {
  groupName: string;
  organizationOid: string;
  description: string;
  invitees: Array<MeetingInvitee>;
  groupOidListForMemberAdd: Array<string>;
  meetingOidForLog: string;


  constructor() {
    super();
  }
}
