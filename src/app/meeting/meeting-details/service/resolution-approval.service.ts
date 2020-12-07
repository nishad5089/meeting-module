import {Injectable} from '@angular/core';
import {ResolutionApproval} from '../../model/resolution-approval';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {MasterService} from '../../core/master.service';
import {service_name} from '../../../constant/service-name.properties';
import {doc_management_paths} from '../../../constant/service-path.properties';

@Injectable({
  providedIn: 'root'
})

export class ResolutionApprovalService extends MasterService<ResolutionApproval> {
  SAVE_PENDING_RESOLUTION_APPROVALS_END_POINT = '/resolution-approval-response';

  constructor(public http: HttpClient) {
    // super(http, ':8504', '/resolutions');
    super(http, service_name.MEM_SERVICE_DOC_MANAGEMENT, doc_management_paths.RESOLUTIONS);
    // this.serviceName = 'mem-service-doc-management';
  }

  public updateResolutionApproval(dto: any): Observable<any> {
    return this.http.post<any>(
      this.getUrl() + this.SAVE_PENDING_RESOLUTION_APPROVALS_END_POINT,
      dto);
  }

  isValid(dto: ResolutionApproval[]) {
  }
}
