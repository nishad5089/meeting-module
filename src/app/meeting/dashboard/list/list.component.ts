import {Component, OnInit} from '@angular/core';
import {MasterListComponent} from '../../core/master-list.component';
import {Meeting} from '../../model/meeting';
import {MeetingService} from '../../../meeting/service/meeting.service';
import {MatDialog, MatSnackBar} from '@angular/material';
import {MeetingSchedule} from '../../model/meeting-schedule';
import {MeetingRoom} from '../../master-settings/meeting-room/model/meeting-room';
import {ActivatedRoute, Router} from '@angular/router';
import {meeting_status} from '../../../constant/meeting-status';
import {info_message} from '../../../constant/messages';
import {roles} from '../../../constant/roles.constant';
import {AuthenticationService} from '../../../shared/security/service/authentication.service';


@Component({
  templateUrl: './list.component.html',
})
export class ListComponent extends MasterListComponent<Meeting> implements OnInit {

  myFilter: any;
  meetingStatuses: Array<object> = [];

  constructor(protected service: MeetingService,
              protected snackbar: MatSnackBar,
              protected dialog: MatDialog,
              protected router: Router,
              private authenticationService: AuthenticationService,
              private route: ActivatedRoute) {
    super(service, dialog, snackbar);
    this.setTableDetails();
    this.setFilter();
  }

  ngOnInit() {
    this.search(new Meeting());
    meeting_status.forEach(a => this.meetingStatuses.push(a));
  }

  goToDetails(meeting: Meeting) {
    this.service.setDetailsTabIndex(1);
    this.router.navigate(['../details/' + meeting.oid], {relativeTo: this.route});
  }

  add(): void {
    this.isLoadingResults = true;
    this.router.navigate(['../create'], {relativeTo: this.route});
  }

  keyDownFunction(event) {
    if (event.key === 'Enter') {
      this.search(this.dto);
    }
  }

  getStatus(status: string): string {
    const statusObject = meeting_status.get(status.toLocaleUpperCase());
    if (statusObject) {
      return statusObject['label'];
    }
  }

  getColorClass(status: string): string {
    const statusObject = meeting_status.get(status.toLocaleUpperCase());
    if (statusObject) {
      return statusObject['color'];
    }
  }

  setMeetingStatus(event) {
    if (!event) {
      this.dto.statusObject = undefined;
      this.dto.meetingStatus = undefined;
      return;
    }
    this.dto.statusObject = event;
    this.dto.meetingStatus = event.tag;
  }

  setMeetingRoom(room: MeetingRoom) {
    if (room === null ) {
      this.dto.meetingRoom = null;
      this.dto.meetingSchedule.meetingRoomOid = undefined;
      return;
    }
    this.dto.meetingRoom = room;
    this.dto.meetingSchedule.meetingRoomOid = room.officeOid;
  }

  setAddModal() {
  }

  setEditModal() {
  }

  setFilter() {

  }

  setTableDetails() {
    this.displayColumns = ['serialNo', 'meetingTitle', 'dateTime', 'room', 'meetingStatus'];
    this.addButtonTooltips = info_message.ADD_MEETING;
    this.dto = new Meeting();
    this.dto.meetingSchedule = new MeetingSchedule();
  }

  setRoomDetails(room: MeetingRoom): string {
    return room.roomName + '(' + room.roomCapacity + ')';
  }

  isMeetingCreator(): boolean {
    return this.authenticationService.currentUserValue && this.authenticationService.currentUserValue.roles.includes(roles.MEM_MEETING_CREATOR);
  }
}
