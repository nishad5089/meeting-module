import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {MeetingAgenda} from '../../model/meeting-agenda';
import {Observable} from 'rxjs';
import {MasterService} from '../../core/master.service';
import {service_name} from '../../../constant/service-name.properties';
import {doc_management_paths} from '../../../constant/service-path.properties';
import {ResponseDataModel} from '../../core/response-data.model';

@Injectable({
  providedIn: 'root'
})
export class MeetingAgendaService extends MasterService<MeetingAgenda> {

  DRAGNDROP_END_POINT = '/dragndrop';

  constructor(public http: HttpClient) {
    super(http, service_name.MEM_SERVICE_DOC_MANAGEMENT, doc_management_paths.AGENDA);
    // super(http, ':8504', '/agendas');
    // this.serviceName = 'mem-service-doc-management';
  }

  isValid(dto: MeetingAgenda[]) {
    // throw new Error('Method not implemented.');
  }

  // createAll(dto: MeetingAgenda[]): Observable<Responsedata<Array<MeetingAgenda>>> {
  //   console.log(this.api_url + this.port + this.path + this.END_POINT_CREATE_ALL);
  //   return this.http.post<Responsedata<Array<MeetingAgenda>>>(
  //     this.getUrl() + this.END_POINT_CREATE_ALL,
  //     dto,
  //     this.httpOptions
  //   );
  // }

  updateSerial(oid: string, meetingOid: string, previous: number, next: number): Observable<ResponseDataModel<MeetingAgenda[]>> {
    const obj = {oid: oid, meetingOid: meetingOid, serialNo: next, oldSerialNo: previous};
    return this.http.post<ResponseDataModel<MeetingAgenda[]>>(
      this.getUrl() + this.DRAGNDROP_END_POINT,
      obj
    );
  }

}
