import {MasterModel} from '../core/master.model';

export class ActionLog extends MasterModel {
  meetingOid: string;
  logType: string;
  details: string;
  viewText: string;

  constructor(meetingOid: string) {
    super();
    this.meetingOid = meetingOid;
  }
}
