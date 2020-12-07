import {MasterModel} from '../core/master.model';

export class Employee extends MasterModel {
  empId: string;
  organizationOid: string;
  designationOid: string;
  departmentOid: string;
  name: string;
  nameEn: string;
  orgName: string;
  departmentName: string;
  designationName: string;
  search: string;

  getName() {
    return this.name;
  }

}
