import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {MasterService} from '../../core/master.service';
import {NoticeForwardingInfo} from '../../model/notice-forwarding-info';
import {service_name} from '../../../constant/service-name.properties';
import {doc_management_paths} from '../../../constant/service-path.properties';

@Injectable({
  providedIn: 'root'
})

export class NoticeForwardingInfoService extends MasterService<NoticeForwardingInfo> {

  SAVE_PENDING_NOTICE_APPROVALS_END_POINT = 'notice-approval-response';

  constructor(public http: HttpClient) {
    super(http, service_name.MEM_SERVICE_DOC_MANAGEMENT, doc_management_paths.NOTICE_FORWARDING_INFOS);
  }

  isValid(dto: NoticeForwardingInfo[]) {
    // throw new Error('Method not implemented.');
  }

  public updateNoticeApproval(dto: any): Observable<any> {
    return this.http.post<any>(
      this.getUrl() + this.SAVE_PENDING_NOTICE_APPROVALS_END_POINT,
      dto
    );
  }

}
