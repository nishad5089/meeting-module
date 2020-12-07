import {Injectable} from '@angular/core';
import {MasterService} from '../../core/master.service';
import {MeetingInvitee} from '../../model/meeting-invitee';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {service_name} from '../../../constant/service-name.properties';
import {invitee_paths} from '../../../constant/service-path.properties';
import {ResponseDataModel} from '../../core/response-data.model';

@Injectable({
  providedIn: 'root'
})

export class InviteeService extends MasterService<MeetingInvitee> {

  BATCH_UPDATE_END_POINT = 'batch-update';
  NOTICE_CIRCULATION_END_POINT = 'circulate-notice';
  RESOLUTION_CIRCULATION_END_POINT = 'circulate-resolution';
  DRAGNDROP_END_POINT = 'dragndrop';

  constructor(public http: HttpClient) {
    // super(http, ':8503', '/invitees');
    super(http, service_name.MEM_SERVICE_INVITEES, invitee_paths.INVITEES);
  }

  isValid(dto: MeetingInvitee[]) {
    // throw new Error('Method not implemented.');
  }

  batchUpdate(invitees: Array<MeetingInvitee>): Observable<any> {
    return this.http.post<any>(
      this.getUrl() + this.BATCH_UPDATE_END_POINT,
      invitees
    );
  }

  sendNotification(invitees: Array<MeetingInvitee>): Observable<any> {
    return this.http.post<any>(
      this.getUrl() + this.NOTICE_CIRCULATION_END_POINT,
      invitees
    );
  }

  sendResolution(invitees: Array<MeetingInvitee>): Observable<any> {
    return this.http.post<any>(
      this.getUrl() + this.RESOLUTION_CIRCULATION_END_POINT,
      invitees
    );
  }

  updateSerial(oid: string, meetingOid: string, previous: number, next: number): Observable<ResponseDataModel<MeetingInvitee[]>> {
    const obj = {oid: oid, meetingOid: meetingOid, serialNo: next, oldSerialNo: previous};
    return this.http.post<ResponseDataModel<MeetingInvitee[]>>(
      this.getUrl() + this.DRAGNDROP_END_POINT,
      obj
    );
  }
}
