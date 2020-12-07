import {MasterModel} from 'app/meeting/core/master.model';

export class Permission extends MasterModel {

  roleTag: string;
  actionTag: string;
  isPermitted: number;
  actionTags: Array<string>;
  combinedMeetingStatus: string;

  constructor(data = {}) {
    super();
    this.roleTag = data['roleTag'];
    this.actionTag = data['actionTag'];
    this.isPermitted = data['isPermitted'];
    this.actionTags = data['actionTags'];
    this.combinedMeetingStatus = data['combinedMeetingStatus'];
  }

}
