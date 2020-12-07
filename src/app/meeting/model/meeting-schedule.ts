import {MasterModel} from '../core/master.model';
import {MeetingRoom} from '../master-settings/meeting-room/model/meeting-room';

export class MeetingSchedule extends MasterModel {
  meetingOid: string;
  meetingRoomOid: string;
  meetingStartTime: Date;
  meetingEndTime: Date;
  meetingDate: Date;
  roomBookingStatus: string;
  approvedBy: string;
  approvedTime: Date;
  remarks: string;
  room: MeetingRoom;
}
