import {MasterModel} from '../core/master.model';

export class NoticeForwardingInfo extends MasterModel {
  approvalMethod: string;
  meetingOid: string;
  approvalStatus: string;
  comment: string;
  cssClass: string;
}
