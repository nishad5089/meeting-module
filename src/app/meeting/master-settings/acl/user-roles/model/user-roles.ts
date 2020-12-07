import {MasterModel} from '../../../../core/master.model';
import {Roles} from '../../roles/model/roles';
import {Employee} from '../../../../model/employee';

export class UserRoles extends MasterModel {

  employeeOid: string;
  roleTag: string;
  employee: Employee;

}
