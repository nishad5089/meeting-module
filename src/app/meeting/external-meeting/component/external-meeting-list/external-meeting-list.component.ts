import {DialogModel, MasterListComponent} from '../../../core/master-list.component';
import {ExternalMeeting} from '../../model/external-meeting';
import {Component} from '@angular/core';
import {MatSnackBar} from '@angular/material/snack-bar';
import {MatDialog} from '@angular/material/dialog';
import {ExternalMeetingService} from '../../service/external-meeting.service';
import {ExternalMeetingCreateComponent} from '../external-meeting-create/external-meeting-create.component';
import {ExternalMeetingDetailsComponent} from '../external-meeting-details/external-meeting-details.component';
import {info_message} from '../../../../constant/messages';
import {DatePipe} from '@angular/common';
import {LocalNumberPipe} from '../../../../shared/pipes/locale-number.pipe';

@Component({
  templateUrl: './external-meeting-list.component.html'
})
export class ExternalMeetingListComponent extends MasterListComponent<ExternalMeeting> {

  constructor(protected service: ExternalMeetingService,
              protected snackbar: MatSnackBar,
              protected dialog: MatDialog
  ) {
    super(service, dialog, snackbar);
    this.settingsName = 'এক্সটারনাল মিটিং';
  }

  setAddModal() {
    this.dialogAddComponent = ExternalMeetingCreateComponent;
    this.dialogAddModel = new DialogModel<ExternalMeeting>();
    this.dialogAddModel.dialogTitle = info_message.ADD_EXTERNAL_MEETING_MODAL;
    this.dialogAddModel.dto = new ExternalMeeting();
  }

  setEditModal() {
    this.dialogEditComponent = ExternalMeetingCreateComponent;
    this.dialogEditModel = new DialogModel<ExternalMeeting>();
    this.dialogEditModel.dialogTitle = info_message.EDIT_EXTERNAL_MEETING_MODAL;
  }

  setFilter() {
  }

  setTableDetails() {
    this.dto = new ExternalMeeting();
    this.displayColumns = ['sl', 'meetingTitle', 'meetingDate', 'actions'];
    this.addButtonTooltips = info_message.ADD_EXTERNAL_MEETING;
  }

  viewExternalMeetingDetails(row: ExternalMeeting) {
    this.dialog.open(ExternalMeetingDetailsComponent, {
      width: '60%',
      data: row
    });
  }

  applyFilter(filterValue: string) {
    const datePipe = new DatePipe('bn-BD');
    const localNumberPipe = new LocalNumberPipe();
    this.dataSource.filterPredicate = (data, filter: string) => {
      const str = data.meetingTitle +
      localNumberPipe.transform(datePipe.transform(data.meetingDate, 'fullDate'));
      return str.toLowerCase().indexOf(filter) !== -1;
    };
    super.applyFilter(filterValue);
  }
}
