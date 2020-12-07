export class MasterModel {

  oid: string;
  createdBy: string;
  updatedBy: string;
  status: string;
  autocomplete: string;
  updatedOn: string;
  createdOn: string;
  officeOid: string;

  setAutocomplete(value: string): void {
    this.autocomplete =  value;
  }

}
