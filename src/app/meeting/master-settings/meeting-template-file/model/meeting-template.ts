import {MasterModel} from '../../../core/master.model';

export class MeetingTemplate extends MasterModel {
  templateTitle: string;
  fileOid: string;
  filePath: string;
  templateType: string;

  constructor(type?: string) {
    super();
    if (type) { this.templateType = type; }
  }
}
