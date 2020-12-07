import {MasterModel} from '../core/master.model';
import {Employee} from './employee';
import {attendance_status} from '../../constant/attendee-status';

export class MeetingInviteesHonorarium extends MasterModel {
  serialNo: number;
  meetingOid: string;
  meetingInviteeOid: string;
  honorarium: number;
  taxDuty: number;
  stampDuty: number;
  totalReceivable: number;
  attendanceStatus: string;
  employee: Employee;
  constructor(meetingOid?: string) {
    super();
    meetingOid ? this.meetingOid = meetingOid : this.attendanceStatus = attendance_status.ABSENT;
    meetingOid ? this.meetingOid = meetingOid : this.honorarium = 0;
    meetingOid ? this.meetingOid = meetingOid : this.taxDuty = 0;
    meetingOid ? this.meetingOid = meetingOid : this.totalReceivable = 0;
    meetingOid ? this.meetingOid = meetingOid : this.stampDuty = 0;
  }
}
