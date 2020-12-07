import {MasterModel} from '../../../../meeting/core/master.model';

export class MeetingType extends MasterModel {
  description: string;
  typeName: string;
  frequencyOid: string;

  setAutocomplete(value: string): void {
    this.typeName =  value;
  }
}
