import {MasterModel} from '../../core/master.model';
import {Settings} from '../settings/model/settings';

export class Guest extends MasterModel {
  nameBn: string;
  nameEn: string;
  organizationOid: string;
  designationOid: string;
  departmentOid: string;
  emailAddress: string;
  contactNo: string;
  pictureFile: string;
  signatureFile: string;
  orgName: string;
  departmentName: string;
  designationName: string;
  officeName: string;
  search: string;
  office: Settings;
  department: Settings;
  designation: Settings;
}
