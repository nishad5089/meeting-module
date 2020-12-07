import {MasterModel} from '../core/master.model';

export class ResolutionApproval extends MasterModel {
  memorandumNumber: string;
  approvedOn: string;
  approvedBy: string;
  resolutionStatus: string;
  meetingOid: string;
  comment: string;
  cssClass: string;
}
