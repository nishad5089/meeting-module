import {MasterModel} from '../core/master.model';

export class MeetingAttachment extends MasterModel {
  attachmentType: string;
  meetingOid: string;
  fileTitle: string;
  fileOid: string;
  filePath: string;
  fileType: string;
  description: string;
  constructor() {
    super();
    this.createdBy = '';
    this.filePath = '';
    this.fileType = '';
    this.fileOid = '';
    this.description = '';
    this.attachmentType = '';
  }
}
