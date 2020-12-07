import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {MasterService} from '../../core/master.service';
import {GroupMember} from '../model/group-member';
import {Observable} from 'rxjs';
import {service_name} from '../../../constant/service-name.properties';
import {groups_paths} from '../../../constant/service-path.properties';

@Injectable({
  providedIn: 'root'
})
export class GroupMembersService extends MasterService<GroupMember> {

  GET_MEMBERS_LIST_WITH_EMPLOYEE = 'get-member-list-with-employee';

  constructor(public http: HttpClient) {
    super(http, service_name.MEM_SERVICE_GROUPS, groups_paths.GROUP_MEMBERS);
  }

  getMemberListWithEmployee(groupMember: GroupMember): Observable<any> {
    return this.http.post<any>(
      this.getUrl() + this.GET_MEMBERS_LIST_WITH_EMPLOYEE,
      groupMember
    );
  }

  isValid(dto: GroupMember[]): boolean {
    return false;
  }
}
