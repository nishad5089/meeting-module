import {MasterModel} from '../../core/master.model';

export class ExternalMeeting extends MasterModel {
  officeName: string;
  meetingReference: string;
  meetingTitle: string;
  meetingType: string;
  meetingRoom: string;
  meetingChairperson: string;
  meetingDate: Date | string | number;
  startTime: Date;
  endTime: Date;
  employeeOid: string;

  constructor() {
    super();
    this.officeName = '';
    this.meetingReference = '';
    this.meetingTitle = '';
    this.meetingType = '';
    this.meetingRoom = '';
    this.meetingChairperson = '';
    this.meetingDate = '';
  }
}
