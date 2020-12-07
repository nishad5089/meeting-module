import {MasterModel} from '../../meeting/core/master.model';

export class User extends MasterModel {
  username: string;
  name: string;
  nameEn: string;
  orgName: string;
  departmentName: string;
  designationName: string;
  access_token: string;
  employeeId: string;
  employeeOfficeId: string;
  roles: string[];
}
