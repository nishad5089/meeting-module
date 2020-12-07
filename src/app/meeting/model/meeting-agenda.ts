import {MasterModel} from '../core/master.model';

export class MeetingAgenda extends MasterModel {
  agenda: string;
  meetingOid: string;
  serialNo: number;
  oldAgenda: MeetingAgenda;
}
