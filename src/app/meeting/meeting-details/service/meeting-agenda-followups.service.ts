import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {MeetingAgendaFollowup} from '../../model/meeting-agenda-followup';
import {Observable} from 'rxjs';
import {MasterService} from '../../core/master.service';
import {service_name} from '../../../constant/service-name.properties';
import {doc_management_paths} from '../../../constant/service-path.properties';
import {ResponseDataModel} from '../../core/response-data.model';

@Injectable({
  providedIn: 'root'
})

export class MeetingAgendaFollowupsService extends MasterService<MeetingAgendaFollowup> {

  DRAGNDROP_END_POINT = 'dragndrop';

  constructor(public http: HttpClient) {
    super(http, service_name.MEM_SERVICE_DOC_MANAGEMENT, doc_management_paths.AGENDA_FOLLOW_UPS);
    // super(http, ':8504', '/agenda-followups');
  }

  updateSerial(oid: string, agendaOid: string, meetingOid: string, previous: number, next: number): Observable<ResponseDataModel<MeetingAgendaFollowup[]>> {
    const obj = {oid: oid, agendaOid: agendaOid, meetingOid: meetingOid, serialNo: next, oldSerialNo: previous};
    return this.http.post<ResponseDataModel<MeetingAgendaFollowup[]>>(
      this.getUrl() + this.DRAGNDROP_END_POINT,
      obj
    );
  }

  isValid(dto: MeetingAgendaFollowup[]) {
  }
}
