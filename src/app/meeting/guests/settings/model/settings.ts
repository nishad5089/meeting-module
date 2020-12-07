import {MasterModel} from '../../../../../app/meeting/core/master.model';

export class Settings extends MasterModel {
  fieldType: string;
  parentOid: string;
  fieldNameBn: string;
  fieldNameEn: string;

  constructor(type?: string) {
    super();
    this.fieldType = type;
  }

  setAutocomplete(value: string): void {
    this.fieldNameBn =  value;
  }

  setEmployeeSettingsAutocomplete(value: string) {
    this.autocomplete =  value;
  }

  setFieldType(value: string): void {
    this.fieldType =  value;
  }
}
