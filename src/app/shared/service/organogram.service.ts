import {Injectable} from '@angular/core';
import {END_POINT_SEARCH, MasterService} from '../../meeting/core/master.service';
import {HttpClient} from '@angular/common/http';
import {Settings} from '../../meeting/guests/settings/model/settings';
import {Observable} from 'rxjs';
import {ResponseDataModel} from '../../meeting/core/response-data.model';
import {service_name} from '../../constant/service-name.properties';
import {invitee_paths} from '../../constant/service-path.properties';
import {MeetingInvitee} from "../../meeting/model/meeting-invitee";

@Injectable({
  providedIn: 'root'
})

export class OrganogramService extends MasterService<Settings> {
  OFFICE_ORGANOGRAM_END_POINT = 'get-office-tree';

  constructor(public http: HttpClient) {
    super(http, service_name.MEM_SERVICE_INVITEES, invitee_paths.ORGANOGRAM);
  }

  public searchAll(dto: Settings): Observable<ResponseDataModel<Settings[]>> {
    return this.http.post<ResponseDataModel<Settings[]>>(
      this.getUrl() + END_POINT_SEARCH,
      dto);
  }

  getOfficeOrganogram(dto: Settings): Observable<any> {
    return this.http.post<any>(
      this.getUrl() + this.OFFICE_ORGANOGRAM_END_POINT,
      dto
    );
  }

  isValid(dto: Settings[]) {
  }
}
