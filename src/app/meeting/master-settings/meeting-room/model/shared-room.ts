import {MasterModel} from '../../../core/master.model';

export class SharedRoom extends MasterModel{
  hasAccess: string;
  roomOid: string;
}
