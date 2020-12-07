import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Observable} from 'rxjs';
import {MeetingDetails} from '../model/meeting-details';
import {MasterService} from '../core/master.service';
import {service_name} from '../../constant/service-name.properties';
import {meeting_details_paths} from '../../constant/service-path.properties';
import {ResponseDataModel} from '../core/response-data.model';

@Injectable({
  providedIn: 'root'
})
export class MeetingDetailsService extends MasterService<MeetingDetails> {

  END_POINT_GET_BASIC_DETAILS = 'get-basic-details';
  END_POINT_GET_BACKGROUND_DETAILS = 'get-background-details';
  END_POINT_NOTICE_DRAFT = 'notice-draft';
  END_POINT_RESOLUTION_DRAFT = 'resolution-draft';
  END_POINT_GET_DOCUMENT_DETAILS = 'get-document-details';
  END_POINT_GET_INVITEES_DETAILS = 'get-invitees-details';
  END_POINT_GET_ATTENDANCE_REPORT = 'generate-report';
  END_POINT_RESOLUTION_DRAFT_DOCX = 'resolution-draft-docx';
  END_POINT_NOTICE_DRAFT_DOCX = 'notice-draft-docx';
  END_POINT_TAX_REPORT = 'generate-tax-report';

  constructor(public http: HttpClient) {
    super(http, service_name.MEM_SERVICE_MEETING_DETAILS, meeting_details_paths.MEETING_DETAILS);
    // super(http, ':8509', '/meeting-details');
    // this.serviceName = 'mem-service-meeting-details';
  }

  public httpFileOptions = {
    responseType: 'blob' as 'json',
    headers: new HttpHeaders({
      'content-type': 'application/json'
    })
  };

  getBasicMeetingDetails (meetingDetails: MeetingDetails): Observable<ResponseDataModel<MeetingDetails>> {
    return this.http.post<ResponseDataModel<MeetingDetails>>(
      this.getUrl() + this.END_POINT_GET_BASIC_DETAILS,
      meetingDetails
    );
  }

  getBackgroundDetails (meetingDetails: MeetingDetails): Observable<ResponseDataModel<MeetingDetails>> {
    return this.http.post<ResponseDataModel<MeetingDetails>>(
      this.getUrl() + this.END_POINT_GET_BACKGROUND_DETAILS,
      meetingDetails
    );
  }

  getMeetingDocuments(meetingDetails: MeetingDetails): Observable<ResponseDataModel<MeetingDetails>> {
    return this.http.post<ResponseDataModel<MeetingDetails>>(
      this.getUrl() + this.END_POINT_GET_DOCUMENT_DETAILS,
      meetingDetails
    );
  }

  getInviteesDetails(meetingDetails: MeetingDetails): Observable<ResponseDataModel<MeetingDetails>> {
    return this.http.post<ResponseDataModel<MeetingDetails>>(
      this.getUrl() + this.END_POINT_GET_INVITEES_DETAILS,
      meetingDetails
    );
  }

  generateNotice(dto: any): Observable<any> {
    return this.http.post<any>(this.getUrl() + this.END_POINT_NOTICE_DRAFT, dto, this.httpFileOptions);
  }

  generateNoticeDocx(dto: any): Observable<any> {
    return this.http.post<any>(this.getUrl() + this.END_POINT_NOTICE_DRAFT_DOCX, dto, this.httpFileOptions);
  }

  generateResolution(dto: any): Observable<any> {
    return this.http.post<any>(this.getUrl() + this.END_POINT_RESOLUTION_DRAFT, dto, this.httpFileOptions);
  }

  generateResolutionDocx(dto: any): Observable<any> {
    return this.http.post<any>(this.getUrl() + this.END_POINT_RESOLUTION_DRAFT_DOCX, dto, this.httpFileOptions);
  }

  generateAttendance(dto: MeetingDetails): Observable<any> {
    return this.http.post<any>(this.getUrl() + this.END_POINT_GET_ATTENDANCE_REPORT, dto, this.httpFileOptions);
  }

  generateTaxReport(dto: MeetingDetails): Observable<any> {
    return this.http.post<any>(this.getUrl() + this.END_POINT_TAX_REPORT, dto, this.httpFileOptions);
  }

  isValid(dto: MeetingDetails[]) {
  }
}
