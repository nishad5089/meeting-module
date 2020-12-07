import {MasterModel} from '../../../core/master.model';
import {Building} from '../../building/model/building';
import {SharedRoom} from './shared-room';

export class MeetingRoom extends MasterModel {
  buildingOid: string;
  floorNo: string;
  roomCapacity: number;
  roomCode: string;
  roomName: string;
  roomNo: string;
  officeOid: string;
  building: Building;
  sharedRoomList: Array<SharedRoom> = [];

  setAutocomplete(value: string): void {
    this.roomName = value;
  }

  getOptionLabel(): string {
    return this.roomName;
  }


}
