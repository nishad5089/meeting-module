import {MasterModel} from '../../core/master.model';
import {Employee} from '../../model/employee';

export class GroupMember extends MasterModel {
  memberType: string;
  memberOid: string;
  organizationOid: string;
  groupOid: string;
  designation: string;
  employee: Employee;
  constructor() {
    super();
  }
}
