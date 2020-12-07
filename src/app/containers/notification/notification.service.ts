import {Injectable} from '@angular/core';

import * as Stomp from 'stompjs';
import * as SockJS from 'sockjs-client';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {service_name} from '../../constant/service-name.properties';
import {cmn_notification_paths} from '../../constant/service-path.properties';
import {notification_status} from '../../constant/notification-status';
import {MasterService} from '../../meeting/core/master.service';
import {END_POINT_WEB_SOCKET_CONNECTION} from '../../constant/api';
import {environment} from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})

export class NotificationService {

  constructor(private http: HttpClient) { }

  // Open connection with the back-end socket
  public connect() {
    const socket = new SockJS(environment.NOTIFICATION_URL + '/' + END_POINT_WEB_SOCKET_CONNECTION);

    return Stomp.over(socket);
  }

  getNotifications(): Observable<any> {
    const dto = {
      moduleCode: 'MEM',
      searchParam: {
        status: 'Active',
        limit: 10,
        offset: 0
      }
    };
    return this.http.post(this.getUrl() + cmn_notification_paths.ALL_NOTIFICATION, dto);
  }

  changeNtfStatus(oids: string[]): Observable<any> {
    const dto = {
      oids: oids
    };

    return this.http.post(this.getUrl()  + cmn_notification_paths.CHANGE_STATUS, dto);
  }

  getNotificationCount(): Observable<any> {
    const dto = {
      moduleCode: 'MEM',
      status: [notification_status.NOT_SENT, notification_status.DELIVERED_NS]
    };

    return this.http.post(this.getUrl()  + cmn_notification_paths.NOTIFICATION_COUNT, dto);
  }

  getUrl(): string {
    return MasterService.getServiceURLFromConfig(service_name.CMN_NOTIFICATION_SERVICE) + '/';
  }


}
