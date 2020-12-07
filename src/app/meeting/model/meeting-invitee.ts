import {MasterModel} from '../core/master.model';
import {Employee} from './employee';
import {attendee_type} from '../../constant/attendee-type';
import {response_status} from '../../constant/attendee-status';

export class MeetingInvitee extends MasterModel {
  meetingOid: string;
  memberOid: string;
  inviteeType: string;
  organizationOid: string;
  attendeeResponseStatus: string;
  nominationCapabilityStatus: string;
  invitationStatus: string;
  ownershipStatus: string;
  acknowledgementStatus: string;
  honorariumStatus: string;
  workingPaperRequirement: string;
  nominatedBy: string;
  signingAuthority: string;
  serialNo: number;
  includeStatus: string;
  remarks: string;
  notificationStatus: string;
  isGroupMember: string;
  employee: Employee;

  static createInvitee(role: string, serial: number, memberOid: string, isGroupMember: string = 'no'): MeetingInvitee {
    return this.createNewInvitee(
      {ownershipStatus: role, serialNo: serial, memberOid: memberOid, meetingOid: '', inviteeType: '', isGroupMember: isGroupMember});
  }

  static createNewInvitee(data: {}): MeetingInvitee {
    if (data['ownershipStatus'] === undefined
      || data['serialNo'] === undefined
      || data['memberOid'] === undefined
      || data['meetingOid'] === undefined
      || data['inviteeType'] === undefined) {
      throw new Error('Please provide mandatory fields');
    }
    const invitee = new MeetingInvitee();
    invitee.ownershipStatus = data['ownershipStatus'];
    invitee.serialNo = data['serialNo'];
    invitee.memberOid = data['memberOid'];
    invitee.meetingOid = data['meetingOid'];
    invitee.inviteeType = data['inviteeType'];
    invitee.nominationCapabilityStatus = data['inviteeType'] === attendee_type.EMPLOYEE ? 'yes' : 'no';
    invitee.honorariumStatus = data['inviteeType'] === attendee_type.EMPLOYEE ? 'yes' : 'no';
    invitee.createdBy = data['createdBy'] ? data['createdBy'] : '';
    invitee.organizationOid = data['organizationOid'] ? data['organizationOid'] : '';
    invitee.attendeeResponseStatus = data['attendeeResponseStatus'] ? data['attendeeResponseStatus'] : response_status.PENDING;
    invitee.nominationCapabilityStatus = data['nominationCapabilityStatus'] ? data['nominationCapabilityStatus'] : 'yes';
    invitee.invitationStatus = data['invitationStatus'] ? data['invitationStatus'] : '';
    invitee.acknowledgementStatus = data['acknowledgementStatus'] ? data['acknowledgementStatus'] : 'no';
    invitee.honorariumStatus = data['honorariumStatus'] ? data['honorariumStatus'] : 'yes';
    invitee.workingPaperRequirement = data['workingPaperRequirement'] ? data['workingPaperRequirement'] : 'no';
    invitee.nominatedBy = data['nominatedBy'] ? data['nominatedBy'] : '';
    invitee.signingAuthority = data['signingAuthority'] ? data['signingAuthority'] : 'no';
    invitee.includeStatus = data['includeStatus'] ? data['includeStatus'] : 'no';
    invitee.status = data['status'] ? data['status'] : 'active';
    invitee.notificationStatus = data['notificationStatus'] ? data['notificationStatus'] : 'no';
    invitee.isGroupMember = data['isGroupMember'] ? data['isGroupMember'] : 'no';
    return invitee;
  }

  getName(): string {
    return this.employee.name;
  }
}
