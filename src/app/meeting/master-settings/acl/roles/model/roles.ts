import {MasterModel} from '../../../../core/master.model';

export class Roles extends MasterModel {
  roleEn: String;
  roleBn: String;
  description: String;
  checked: boolean;
  roleType: string;
  roleTag: string;
}
