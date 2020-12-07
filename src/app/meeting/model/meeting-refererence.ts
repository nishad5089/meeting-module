import {MasterModel} from '../core/master.model';
import {Meeting} from './meeting';

export class MeetingRefererence extends MasterModel {

  meeting: Meeting;

  constructor(public referenceOid: string,
              public meetingOid: string = '',
              public createdBy: string = '') {
    super();
  }

}
