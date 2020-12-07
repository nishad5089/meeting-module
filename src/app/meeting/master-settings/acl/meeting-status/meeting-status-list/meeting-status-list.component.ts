import {DialogModel, MasterListComponent} from '../../../../core/master-list.component';
import {MeetingStatus} from '../model/meeting-status';
import {Component, OnInit} from '@angular/core';
import {MatDialog, MatSnackBar} from '@angular/material';
import {MeetingStatusService} from '../service/meeting-status.service';
import {MeetingStatusCreateComponent} from '../meeing-status-create/meeting-status-create.component';

@Component({
  templateUrl: 'meeting-status-list.component.html'
})

export class MeetingStatusListComponent extends MasterListComponent<MeetingStatus> implements OnInit {

  constructor(protected service: MeetingStatusService,
              protected snackbar: MatSnackBar,
              protected dialog: MatDialog
  ) {
    super(service, dialog, snackbar);
    this.dto = new MeetingStatus();
  }

  ngOnInit() {
    super.ngOnInit();

    setTimeout(() => {
    }, 1500);
  }

  setAddModal() {
    this.dialogAddComponent = MeetingStatusCreateComponent;
    this.dialogAddModel = new DialogModel<MeetingStatus>();
    this.dialogAddModel.dialogTitle = 'মিটিং অবস্থা যুক্তকরণ​';
    this.dialogAddModel.dto = new MeetingStatus();
  }

  setEditModal() {
    this.dialogEditComponent = MeetingStatusCreateComponent;
    this.dialogEditModel = new DialogModel<MeetingStatus>();
    this.dialogEditModel.dialogTitle = 'মিটিং অবস্থা সম্পাদনকরণ';
  }

  setFilter() {
  }

  setTableDetails() {
    this.displayColumns = ['sl', 'meetingStatusTitle', 'meetingStatusTag', 'meetingStatusLevel', 'actions'];
    this.addButtonTooltips = 'মিটিং অবস্থা যোগ করুন​';
  }

}
