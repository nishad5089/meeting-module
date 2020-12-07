import {Component, EventEmitter, OnInit, Output, ViewChild} from '@angular/core';
import {MatDialog, MatPaginator, MatSnackBar, MatSort, MatTableDataSource} from '@angular/material';
import {Response} from '../../model/response';
import {NominationComponent} from './nomination/nomination.component';
import {MeetingInvitee} from '../../../model/meeting-invitee';
import {MeetingDetails} from '../../../model/meeting-details';
import {AuthenticationService} from '../../../../shared/security/service/authentication.service';
import {MeetingService} from '../../../service/meeting.service';
import {TodosService} from '../../services/todos.service';
import {ConfirmationComponent} from '../../../../shared/confirmation/confirmation.component';
import {attendee_type} from '../../../../constant/attendee-type';
import {response_status} from '../../../../constant/attendee-status';
import {roles} from '../../../../constant/roles.constant';
import {error_message, icon_message, info_message, success_message, warn_message} from '../../../../constant/messages';

@Component({
  selector: 'app-response',
  templateUrl: './response.component.html',
  styleUrls: [
    './response.component.css'
  ]
})

export class ResponseComponent implements OnInit {
  responses: Array<Response>;
  dataSource: MatTableDataSource<Response>;
  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
  @ViewChild(MatSort, {static: true}) sort: MatSort;

  @Output() sendPendingResponses = new EventEmitter<number>();
  pendingResponsesCount = 0;

  isLoadingResults = false;

  displayColumns: string[] = ['serialNo', 'meetingTitle', 'dateTime', 'nominationStatus', 'actions'];

  constructor(public dialog: MatDialog,
              public todosService: TodosService,
              protected snackBar: MatSnackBar,
              public meetingService: MeetingService,
              protected authenticationService: AuthenticationService) {
    this.responses = new Array<Response>();
    this.dataSource = new MatTableDataSource(this.responses);
  }

  ngOnInit() {
    const newInvitee = new MeetingInvitee();
    newInvitee.memberOid = this.authenticationService.currentUserValue.employeeOfficeId;
    this.isLoadingResults = true;
    this.todosService.getResponses(newInvitee).subscribe(response => {
      if (response.status !== 200) {
        return;
      }
      response.data.forEach(resdata => {
        const key: MeetingInvitee = resdata.invitee;
        const value: MeetingDetails = resdata.meetingInfos;
        const newResponse = new Response();
        newResponse.meetingOid = value.oid;
        newResponse.invitationOid = key.oid;
        newResponse.attendeeResponseStatus = key.attendeeResponseStatus;
        newResponse.ownershipStatus = key.ownershipStatus;
        newResponse.nominationCapabilityStatus = key.nominationCapabilityStatus;
        newResponse.meetingTitle = value.meetingTitle;
        newResponse.meetingRoomName = value.meetingRoom.roomName;
        newResponse.meetingDate = value.meetingSchedule.meetingDate;
        newResponse.meetingStartTime = value.meetingSchedule.meetingStartTime;
        newResponse.meetingEndTime = value.meetingSchedule.meetingEndTime;
        this.responses.push(newResponse);
      });

      this.dataSource = new MatTableDataSource(this.responses);
      if (this.dataSource.data.length > 1) {
        this.dataSource.data.sort((a, b) => {
          // @ts-ignore
          return a.meetingStartTime - b.meetingStartTime;
        });
      }
      this.pendingResponsesCount = this.responses.length;
      this.sendPendingResponses.emit(this.pendingResponsesCount);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    }, error1 => {},
      () => {
        this.isLoadingResults = false;
      });
  }

  isNominated(element) {
    if (element.nominationCapabilityStatus === 'no') {
      return {color: 'green', value: 'done'};
    } else {
      return {color: 'red', value: 'close'}; }
  }

  openNomination(row: Response): void {
    const nominationComponent = this.dialog.open(NominationComponent, {
      width: '40%',
      data: new MeetingInvitee()
    });
    nominationComponent.afterClosed().subscribe( result => {
      if (result === undefined) {
        return;
      }
      const newInvitee = MeetingInvitee.createInvitee(roles.MEM_MEETING_MEMBER, 0, result.oid);
      newInvitee.nominatedBy = this.authenticationService.currentUserValue.employeeOfficeId;
      newInvitee.meetingOid = row.meetingOid;
      newInvitee.attendeeResponseStatus = response_status.PENDING;
      newInvitee.nominationCapabilityStatus = 'no';
      newInvitee.inviteeType = attendee_type.EMPLOYEE;
      newInvitee.invitationStatus = '';
      newInvitee.createdBy = this.authenticationService.currentUserValue.employeeOfficeId;
      this.isLoadingResults = true;
      this.todosService.saveResponses(newInvitee).subscribe(response => {
        if (response.status !== 200) {
          this.snackBar.open(error_message.NOMINATE)._dismissAfter(3000);
          return;
        }
        this.snackBar.open(success_message.NOMINATE)._dismissAfter(3000);
        this.responses.splice(this.responses.indexOf(row), 1);
        this.sendPendingResponses.emit(this.responses.length);
        this.dataSource = new MatTableDataSource<Response>(this.responses);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      }, error1 => {
      }, () => {
        this.isLoadingResults = false;
      });
    });
  }

  openConfirmation(answer, element) {
    let MSG;
    answer === response_status.GOING ?
      MSG = warn_message.GOING_CONFIRMATION_PART_1 + '<b>' + element.meetingTitle + '</b>' + warn_message.GOING_CONFIRMATION_PART_2
      : MSG = warn_message.NOT_GOING_CONFIRMATION_PART_1 + '<b>' + element.meetingTitle + '</b>' + warn_message.NOT_GOING_CONFIRMATION_PART_2;
    const confirmationDialogComponent = this.dialog.open(ConfirmationComponent, {
      width: '25%',
      data: {value: answer, message: MSG}
    });

    confirmationDialogComponent.afterClosed().subscribe(result => {
      if (result !== undefined) {
        const newInvitee = new MeetingInvitee();
        newInvitee.oid = element.invitationOid;
        newInvitee.attendeeResponseStatus = answer;
        this.isLoadingResults = true;
        this.todosService.saveResponses(newInvitee).subscribe(response => {
          if (response.status !== 200) {
            this.snackBar.open(error_message.RESPOND)._dismissAfter(3000);
          }
          answer === response_status.GOING ?
            element.attendeeResponseStatus = response_status.GOING :
            element.attendeeResponseStatus = response_status.NOT_GOING;
          this.snackBar.open(success_message.RESPOND)._dismissAfter(3000);
          this.responses.splice(this.responses.indexOf(element), 1);
          this.sendPendingResponses.emit(this.responses.length);
          this.dataSource = new MatTableDataSource<Response>(this.responses);
          this.dataSource.paginator = this.paginator;
          this.dataSource.sort = this.sort;
          this.isLoadingResults = false;
        });
      }
    });
  }

  getResponseStatus(element) {
    if (element.attendeeResponseStatus === response_status.PENDING) {
      return {value: icon_message.PENDING, tip: info_message.PENDING};
    } else if (element.attendeeResponseStatus === response_status.GOING) {
      return {value: icon_message.GOING, tip: info_message.GOING};
    } else if (element.attendeeResponseStatus === response_status.NOT_GOING) {
      return {value: icon_message.NOT_GOING, tip: info_message.NOT_GOING};
    }
  }
}
