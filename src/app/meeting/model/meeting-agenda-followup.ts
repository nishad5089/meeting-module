import {MasterModel} from '../core/master.model';

export class MeetingAgendaFollowup extends MasterModel {
  discussion: string;
  decision: string;
  responsibleEntity: string;
  serialNo: number;
  agendaOid: string;
  oldAgendaFollowup: MeetingAgendaFollowup;
  constructor() {
    super();
  }
}
