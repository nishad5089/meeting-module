import {MasterService} from '../../../../core/master.service';
import {Action} from '../model/action';
import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {service_name} from '../../../../../constant/service-name.properties';


@Injectable({
  providedIn: 'root'
})


export class ActionService extends MasterService<Action> {

  public static PATH = '/acl/actions';
  public static REQUEST_PATH = '/meetings/actions';

  public static ACTION_MEETING_EDIT = 'meeting_edit';
  public static ACTION_MEETING_COPY = 'meeting_copy';
  public static ACTION_MEETING_ATTENDANCE = 'meeting_attendance';
  public static ACTION_MEETING_CANCEL = 'meeting_cancel';
  public static ACTION_MEETING_RESCHEDULE = 'meeting_reschedule';
  public static ACTION_MEETING_DELETE = 'meeting_delete';
  public static ACTION_MEETING_NOTICE_PREPARE = 'meeting_notice_prepare';
  public static ACTION_MEETING_NOTICE_APPROVE = 'meeting_notice_approve';
  public static ACTION_MEETING_NOTICE_CIRCULATE = 'meeting_notice_circulate';
  public static ACTION_MEETING_RESOLUTION_PREPARE = 'meeting_resolution_prepare';
  public static ACTION_MEETING_RESOLUTION_APPROVE = 'meeting_resolution_approve';
  public static ACTION_MEETING_RESOLUTION_CIRCULATE = 'meeting_resolution_circulate';
  public static ACTION_MEETING_CREATE = 'create_meeting';
  public static ACTION_AGENDA_ADD = 'agenda_add';
  public static ACTION_AGENDA_EDIT = 'agenda_edit';
  public static ACTION_AGENDA_DELETE = 'agenda_delete';
  public static ACTION_MEMBER_ADD = 'member_add';
  public static ACTION_NON_MEMBER_ADD = 'non_member_add';
  public static ACTION_MEMBER_EDIT = 'member_edit';
  public static ACTION_MEMBER_DELETE = 'member_delete';
  public static ACTION_SAVE_AS_GROUP = 'member_as_group';
  public static ACTION_REMARKS_ADD = 'remarks_add';

  // WP tags


  protected constructor(public http: HttpClient) {
    super(http, service_name.MEM_SERVICE_MASTER_SETTINGS, ActionService.REQUEST_PATH);
  }

  isValid(dto: Action[]): boolean {
    return false;
  }
}
