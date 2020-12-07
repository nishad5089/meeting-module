import {Injectable} from '@angular/core';
import {Group} from '../../../../app/meeting/groups/model/group';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {MasterService} from '../../../../app/meeting/core/master.service';
import {service_name} from '../../../constant/service-name.properties';
import {groups_paths} from '../../../constant/service-path.properties';

@Injectable({
  providedIn: 'root'
})
export class GroupService extends MasterService<Group> {

  SAVE_AS_GROUP_END_POINT = 'save-as-group';
  GET_MEMBERS_OF_SELECTED_GROUPS_END_POINT = 'get-members-of-selected-groups';

  constructor(public http: HttpClient) {
    super(http, service_name.MEM_SERVICE_GROUPS, groups_paths.GROUPS);
    // super(http, ':8508', '/groups');
  }

  saveAsGroup(group: Group): Observable<any> {
    return this.http.post<any>(
      this.getUrl() + this.SAVE_AS_GROUP_END_POINT,
      group
    );
  }

  getSelectedGroupMembers(group: Group): Observable<any> {
    return this.http.post<any>(
      this.getUrl() + this.GET_MEMBERS_OF_SELECTED_GROUPS_END_POINT,
      group
    );
  }

  isValid(dto: Group[]) {
  }

}
