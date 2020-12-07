import {Component, OnInit} from '@angular/core';
import {MatDialog, MatSnackBar} from '@angular/material';
import {MasterListComponent} from 'app/meeting/core/master-list.component';
import {Meeting} from 'app/meeting/model/meeting';
import {MeetingService} from 'app/meeting/service/meeting.service';

@Component({
  selector: 'app-room-conflict',
  templateUrl: 'room-conflict.component.html',
})

export class RoomConflictComponent extends MasterListComponent<Meeting> implements OnInit {

  constructor(protected service: MeetingService,
              protected snackbar: MatSnackBar,
              protected dialog: MatDialog
  ) {
    super(service, dialog, snackbar);
    this.dto = new Meeting();
  }

  setAddModal() {
  }

  setEditModal() {
  }

  setFilter() {
  }

  setTableDetails() {
    this.displayColumns = ['serialNo', 'meetingTitle', 'actions'];
  }

  ngOnInit() {
    this.dto.meetingStatus = 'meeting_created_with_room_conflict';
    this.search(this.dto);
  }

  getDetails(going: string, element: any) {

  }
}
