import {Component, Inject, OnDestroy} from '@angular/core';
import {DOCUMENT} from '@angular/common';
import {NavData, navItems} from '../../_nav';
import {AuthenticationService} from '../../shared/security/service/authentication.service';
import {User} from '../../shared/model/user';
import {environment} from '../../../environments/environment';
import {Employee} from '../../meeting/model/employee';
import {EmployeeService} from '../../shared/service/employee.service';
import {NotificationService} from '../notification/notification.service';
import * as _ from 'lodash';
import {roles} from '../../constant/roles.constant';
import {NotificationModel} from '../notification/notification.model';
import {notification_status} from '../../constant/notification-status';
import {Observable, Subscription} from 'rxjs';


@Component({
  selector: 'app-dashboard',
  templateUrl: './default-layout.component.html'
})
export class DefaultLayoutComponent implements OnDestroy {
  public navItems: Array<NavData>;
  public sidebarMinimized = true;
  private changes: MutationObserver;
  public element: HTMLElement;
  public user: User = new User();
  public notificationCount: number = 0;
  notifications: NotificationModel[] = [];
  public disabled = true;
  private stompClient = null;
  public clicked: boolean = false;
  private subscription: Subscription;

  constructor(private authenticationService: AuthenticationService,
              private employeeService: EmployeeService,
              protected notificationService: NotificationService,
              @Inject(DOCUMENT) _document?: any) {
    this.changes = new MutationObserver((mutations) => {
      this.sidebarMinimized = _document.body.classList.contains('sidebar-minimized');
    });
    this.element = _document.body;
    this.changes.observe(<Element>this.element, {
      attributes: true,
      attributeFilter: ['class']
    });

    this.setNavData();
    //this.user = authenticationService.currentUserValue;

    // if (this.user) {
    //   this.connect();
    //   this.getNotificationCount();
    //   const employee = new Employee();
    //   employee.oid = authenticationService.currentUserValue.employeeOfficeId;
    //   this.employeeService.getOne(employee).subscribe(emp => {
    //     if (emp.status !== 200) {
    //       this.user.name = 'Could not find data';
    //       this.user.nameEn = '';
    //       this.user.orgName = emp.data.orgName;
    //       this.user.designationName = emp.data.designationName;
    //       this.user.departmentName = emp.data.departmentName;
    //     }
    //     this.user.name = emp.data.name;
    //     this.user.nameEn = emp.data.nameEn;
    //     this.user.orgName = emp.data.orgName;
    //     this.user.designationName = emp.data.designationName;
    //     this.user.departmentName = emp.data.departmentName;
    //     this.authenticationService.cus(JSON.stringify(this.user));
    //     localStorage.setItem('currentUser', JSON.stringify(this.user));
    //   });
    // }
  }

  setConnected(connected: boolean) {
    this.disabled = !connected;

    if (connected) {
      this.notifications = [];
    }
  }

  connect() {
    this.stompClient = this.notificationService.connect();
    if (this.stompClient === undefined) {
      return;
    }
    const userFound: User = JSON.parse(localStorage.getItem('currentUser'));
    this.stompClient.connect({'user': 'Bearer ' + userFound.access_token, 'moduleCode': 'MEM'}, frame => {
      this.stompClient.subscribe('/user/queue/reply', notifications => {

        if (notifications.body) {
          this.notificationCount++;
        }
        this.notifications.unshift(JSON.parse(notifications.body));
      });
    }, this.errorCallBack);
  }

  errorCallBack(error) {
    console.log('errorCallBack -> ' + error);
    setTimeout(() => {
      this.connect();
    }, 5000);
  }

  clickNtf(ntf: NotificationModel): Observable<any> {
    const oids: string[] = [];
    oids.push(ntf.oid);
    ntf.status = notification_status.SEEN;
    return this.notificationService.changeNtfStatus(oids);
  }

  disconnect() {
    if (this.stompClient != null) {
      try {
        this.stompClient.disconnect();
      } catch (e) {
        console.log(e);
      }
    }
    this.setConnected(false);
  }

  getNotifications() {
    this.notificationService.getNotifications().subscribe(result => {
      if (result != null) {
        this.notifications = result['data'];
      }
    });
  }

  clickNtfBar() {
    this.clicked = true;
    this.getNotifications();
    this.notificationCount = 0;
  }

  getNotificationCount() {
    this.notificationService.getNotificationCount().subscribe(result => {
      if (result != null) {
        this.notificationCount = this.notificationCount + +result['data']['notificationCount'];
      }
    });
  }

  ngOnDestroy(): void {
    this.changes.disconnect();
    this.subscription.unsubscribe();
    this.disconnect();
  }

  logOut() {
    this.authenticationService.logout();
  }

  goToGlobalDashboard() {
    window.location.replace(environment.LOG_IN_API_Endpoint + '#GRP_DASHBOARD#');
  }

  setNavData() {
  
    this.navItems = _.cloneDeep(navItems);
    // this.subscription = this.authenticationService.currentUserSubject.subscribe(user => {
    //   if (user.roles && user.roles.includes(roles.MEM_MEETING_ADMIN) === false) {
    //     this.navItems = this.navItems.filter(x => x.name !== 'মাস্টার সেটিংস');
    //   } else {
    //     // remove last 3 items from nav list-> master settings
    //     this.navItems[6].children[5].children.splice(2, 3);
    //   }
    // });
  }

  isAlertOpen(): boolean {
    return !environment.IS_MODAL_OPEN;
  }

  goToUrl(ntf: NotificationModel) {
    this.clickNtf(ntf).subscribe(x => {
      if (ntf.url) {
        window.location.replace(ntf.url);
      }
    });
  }

  setPointer(ntf: NotificationModel): string {
    return ntf.url ? 'pointer' : 'unset';
  }

  setBackground(ntf: NotificationModel): string {
    return ntf.status !== notification_status.SEEN ? 'rgb(200, 255, 188)' : 'white';
  }
}
