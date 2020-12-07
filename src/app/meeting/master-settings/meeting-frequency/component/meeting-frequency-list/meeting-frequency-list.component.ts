import {Component, OnInit} from '@angular/core';
import {DialogModel, MasterListComponent} from '../../../../core/master-list.component';
import {MeetingFrequency} from '../../model/meeting-frequency';
import {MatDialog, MatSnackBar} from '@angular/material';
import {MeetingFrequencyService} from '../../service/meeting-frequency.service';
import {MeetingFrequencySaveComponent} from '../meeting-frequency-save/meeting-frequency-save.component';

@Component({
  templateUrl: './meeting-frequency-list.component.html',
})
export class MeetingFrequencyListComponent extends MasterListComponent<MeetingFrequency> {

  constructor(protected service: MeetingFrequencyService,
              protected snackbar: MatSnackBar,
              protected dialog: MatDialog
  ) {
    super(service, dialog, snackbar);
    this.dto = new MeetingFrequency();
    this.settingsName = 'পুনরাবৃত্তি';
  }

  setAddModal() {
    this.dialogAddComponent = MeetingFrequencySaveComponent;
    this.dialogAddModel = new DialogModel<MeetingFrequency>();
    this.dialogAddModel.dto = new MeetingFrequency();
    this.dialogAddModel.dialogTitle = 'মিটিংয়ের পুনরাবৃত্তি যুক্তকরণ​';
  }

  setEditModal() {
    this.dialogEditComponent = MeetingFrequencySaveComponent;
    this.dialogEditModel = new DialogModel<MeetingFrequency>();
    this.dialogEditModel.dialogTitle = 'মিটিংয়ের পুনরাবৃত্তি সম্পাদনকরণ​';
  }

  setFilter() {
  }

  setTableDetails() {
    this.dto = new MeetingFrequency();
    this.displayColumns = ['sl', 'frequency', 'actions'];
    this.addButtonTooltips = 'মিটিংয়ের পুনরাবৃত্তি যোগ করুন​';
  }

}
