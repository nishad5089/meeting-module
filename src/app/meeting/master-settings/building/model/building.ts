import {MasterModel} from '../../../core/master.model';

export class Building extends MasterModel {
  buildingName: string;
  address: string;

  setAutocomplete(value: string): void {
    this.buildingName =  value;
  }
}
