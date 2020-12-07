import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {TodosService} from '../../../todos/services/todos.service';
import {MeetingInvitee} from '../../../model/meeting-invitee';
import {AuthenticationService} from '../../../../shared/security/service/authentication.service';
import {MeetingDetails} from '../../../model/meeting-details';

@Component({
  selector: 'app-dashboard-todos',
  templateUrl: './dashboard-todos.component.html',
  styleUrls: [
    './dashboard-todos.component.css'
  ]
})

export class DashboardTodosComponent implements OnInit {
  todos: Array<any>;

  @Output() loadingEvent = new EventEmitter<boolean>();

  constructor(protected todosService: TodosService,
              protected authenticationService: AuthenticationService) {
    this.todos = new Array<any>();
  }

  ngOnInit(): void {
    const invitee = new MeetingInvitee();
    invitee.memberOid = this.authenticationService.currentUserValue.employeeOfficeId;
    this.loadingEvent.emit(true);
    this.todosService.getResponses(invitee).subscribe(responses => {
      const res = responses.data;
      res.forEach(resp => {
        const key: MeetingInvitee = resp.invitee;
        const value: MeetingDetails = resp.meetingInfos;
        const msg = 'আপনি ' + value.meetingTitle + ' মিটিংয়ে আমন্ত্রিত হয়েছেন​';
        this.todos.push({msg: msg, link: value.oid});
      });
      this.todosService.getPendingNoticeRequests(invitee).subscribe(notices => {
        const not = notices.data;
        not.forEach(resp => {
          const key = Object.keys(resp)[0];
          // @ts-ignore
          const value: MeetingDetails = Object.values(resp)[0];
          const msg = 'আপনাকে ' + value.meetingTitle + ' মিটিংয়ের​ নোটিশ​ অনুমোদনের​ অনুরোধ করা হয়েছে';
          this.todos.push({msg: msg, link: value.oid});
        });
        this.todosService.getPendingWorkingPaperRequests(invitee).subscribe(requests => {
          const wor = requests.data;
          wor.forEach(resp => {
            const key = Object.keys(resp)[0];
            // @ts-ignore
            const value: MeetingDetails = Object.values(resp)[0];
            const msg = 'আপনাকে ' + value.meetingTitle + ' মিটিংয়ে কার্যপত্র প্রদানের​ অনুরোধ করা হয়েছে';
            this.todos.push({msg: msg, link: value.oid});
          });
          this.todosService.getPendingResolutionRequests(invitee).subscribe(resolutions => {
            const resolution = resolutions.data;
            resolution.forEach(resp => {
              const key = Object.keys(resp)[0];
              // @ts-ignore
              const value: MeetingDetails = Object.values(resp)[0];
              const msg = 'আপনাকে ' + value.meetingTitle + ' মিটিংয়ের​ কার্যবিবরণী অনুমোদনের​ অনুরোধ করা হয়েছে';
              this.todos.push({msg: msg, link: value.oid});
            });
            this.loadingEvent.emit(false);
          });
        });
      });
    });
  }


}
