import {Injectable} from '@angular/core';
import {MasterService} from '../core/master.service';
import {MeetingAttachment} from '../model/meeting-attachment';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {service_name} from '../../constant/service-name.properties';
import {cmn_file_paths} from '../../constant/service-path.properties';
import {Observable} from 'rxjs';
import {END_POINT_FILE_DOWNLOAD} from '../../constant/api';
import {environment, IS_LIVE} from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})

export class CmnFileService extends MasterService<MeetingAttachment> {

  public httpFileOptions = {
    responseType: 'blob' as 'json',
    headers: new HttpHeaders({
      'content-Type': 'application/json',
    })
  };

  constructor(public http: HttpClient) {
    super(http, service_name.CMN_FILE_SERVICE, cmn_file_paths.FILES);
  }

  isValid(dto: MeetingAttachment[]) {
  }

  getUrl(): string {
    let url = environment.GLOBAL_GATEWAY_URL;
    if (IS_LIVE) {
      url += '/' + service_name.CMN_FILE_SERVICE;
    }
    return url + '/' + service_name.CMN_FILE_SERVICE + this.path + '/';
  }

  downloadFile(dto: any): Observable<any> {
    return this.http.post<any>(this.getUrl() + END_POINT_FILE_DOWNLOAD, dto, this.httpFileOptions);
  }

}
