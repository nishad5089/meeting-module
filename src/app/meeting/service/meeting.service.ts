import {Injectable} from '@angular/core';
import {END_POINT_CREATE, MasterService} from '../core/master.service';
import {Meeting} from '../model/meeting';
import {HttpClient} from '@angular/common/http';
import {MeetingAttachment} from '../model/meeting-attachment';
import {BehaviorSubject, Observable} from 'rxjs';
import {MeetingDetails} from '../model/meeting-details';
import {ResponseDataModel} from '../core/response-data.model';
import {service_name} from '../../constant/service-name.properties';
import {meeting_paths} from '../../constant/service-path.properties';

export const HTTP_STATUS_OK = 200;

@Injectable({
  providedIn: 'root'
})

export class MeetingService extends MasterService<Meeting> {


  protected constructor(public http: HttpClient) {
    // super(http, '/mem-service-meetings', '/meetings');
    super(http, service_name.MEM_SERVICE_MEETINGS, meeting_paths.MEETINGS);
  }

  END_POINT_EDIT = 'edit';
  END_POINT_COPY = 'copy';
  END_POINT_RESCHEDULE = 'reschedule';
  END_POINT_CANCEL = 'cancel';

  // this is a dummy date to identify the creation from calendar
  private meetingDateSource = new BehaviorSubject(new Date(123));
  private meeting = new BehaviorSubject(new Meeting());
  private meetingDetailsTabIndexSource = new BehaviorSubject(-1);
  meetingDetailsTabIndex = this.meetingDetailsTabIndexSource.asObservable();
  meetingDate = this.meetingDateSource.asObservable();
  meetingObs = this.meeting.asObservable();

  isValid(dto: Meeting[]) {
  }

  createWhole(dto: FormData): Observable<ResponseDataModel<Meeting>> {
    // this.isValid([dto]); // if not throw exception
    return this.http.post<ResponseDataModel<Meeting>>(this.getUrl() + END_POINT_CREATE, dto);
  }

  setMeetingDate(date: Date) {
    this.meetingDateSource.next(date);
  }

  setMeeting(dto: Meeting) {
    this.meeting.next(dto);
  }

  setDetailsTabIndex(index: number) {
    this.meetingDetailsTabIndexSource.next(index);
  }

  meetingEdit(meetingDetails: MeetingDetails): Observable<any> {
    return this.http.post<any>(
      this.getUrl() + this.END_POINT_EDIT,
      meetingDetails
    );
  }

  meetingCopy(meetingDetails: MeetingDetails): Observable<any> {
    return this.http.post<any>(
      this.getUrl() + this.END_POINT_COPY,
      meetingDetails
    );
  }

  meetingCancel(meetingDetails: MeetingDetails): Observable<any> {
    return this.http.post<any>(
      this.getUrl() + this.END_POINT_CANCEL,
      meetingDetails,
    );
  }

  meetingReschedule(meetingDetails: MeetingDetails): Observable<any> {
    return this.http.post<any>(
      this.getUrl() + this.END_POINT_RESCHEDULE,
      meetingDetails
    );
  }
}
