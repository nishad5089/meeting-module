import {MasterModel} from '../../../core/master.model';

export class MeetingFrequency extends MasterModel {
  frequency: string;

  setAutocomplete(value: string): void {
    this.frequency =  value;
  }

}
