import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Observable} from 'rxjs';
import {MeetingAttachment} from '../../model/meeting-attachment';
import {MasterService} from '../../core/master.service';
import {service_name} from '../../../constant/service-name.properties';
import {invitee_paths} from '../../../constant/service-path.properties';

@Injectable({
  providedIn: 'root'
})

export class TodosService extends MasterService <MeetingAttachment> {

  GET_RESPONSE_END_POINT = 'pending-meeting-responses';
  SAVE_RESPONSE_END_POINT = 'saving-responses';
  GET_PENDING_NOTICE_APPROVALS_END_POINT = 'pending-notice-approval-requests';
  GET_PENDING_WORKING_PAPER_REQUESTS_END_POINT = 'working-paper-requests';
  SAVE_UPLOADED_WORKING_PAPER = 'working-paper-upload';
  GET_PENDING_RESOLUTION_APPROVALS_END_POINT = 'pending-resolution-approval-requests';

  constructor(public http: HttpClient) {
    super(http, service_name.MEM_SERVICE_INVITEES, invitee_paths.TODOS);
    // super(http, ':8503', '/invitees/to-dos');
  }

  public httpOptions = {
    headers: new HttpHeaders({
      'content-Type': 'application/json',
    })
  };

  getResponses(dto: any): Observable<any> {
    return this.http.post<any>(this.getUrl() + this.GET_RESPONSE_END_POINT, dto, this.httpOptions);
    // return this.http.post<any>('http://192.168.1.26:8503/invitees/to-dos/pending-meeting-responses', dto, this.httpOptions);
  }

  saveResponses(dto: any): Observable<any> {
    return this.http.post<any>(this.getUrl() + this.SAVE_RESPONSE_END_POINT, dto, this.httpOptions);
    // return this.http.post<any>('http://192.168.1.26:8503/invitees/to-dos/saving-responses', dto, this.httpOptions);
  }

  getPendingWorkingPaperRequests(dto: any): Observable<any> {
    return this.http.post<any>(this.getUrl() + this.GET_PENDING_WORKING_PAPER_REQUESTS_END_POINT,
      dto, this.httpOptions);
  }

  saveUploadedWorkingPaper(dto: any): Observable<any> {
    return this.http.post<any>(this.getUrl() + this.SAVE_UPLOADED_WORKING_PAPER,
      dto, this.httpOptions);
  }

  getPendingNoticeRequests(dto: any): Observable<any> {
    return this.http.post<any>(this.getUrl() + this.GET_PENDING_NOTICE_APPROVALS_END_POINT,
      dto, this.httpOptions);
    // return this.http.post<any>('http://192.168.1.26' + ':' + 8533 + this.PATH + this.GET_PENDING_NOTICE_APPROVALS_END_POINT,
    //   dto, this.httpOptions);
  }

  getPendingResolutionRequests(dto: any): Observable<any> {
    return this.http.post<any>(this.getUrl() + this.GET_PENDING_RESOLUTION_APPROVALS_END_POINT,
      dto, this.httpOptions);
  }

  isValid(dto: MeetingAttachment[]) {
  }
}
