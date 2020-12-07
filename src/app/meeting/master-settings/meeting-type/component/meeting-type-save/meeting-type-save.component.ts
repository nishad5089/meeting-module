import {Component, Inject, OnInit} from '@angular/core';
import {MasterAddComponent} from '../../../../core/master-add.component';
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef, MatSnackBar} from '@angular/material';
import {DialogModel} from '../../../../core/master-list.component';
import {MeetingType} from '../../../../master-settings/meeting-type/model/meeting-type';
import {MeetingTypeService} from '../../../../master-settings/meeting-type/service/meeting-type.service';
import {MeetingFrequency} from '../../../meeting-frequency/model/meeting-frequency';
import {MeetingFrequencyService} from '../../../meeting-frequency/service/meeting-frequency.service';

@Component({
  templateUrl: './meeting-type-save.component.html',
})
export class MeetingTypeSaveComponent extends MasterAddComponent<MeetingType> {

  public frequencies: Array<MeetingFrequency> = [];

  constructor(
    public dialogRef: MatDialogRef<MeetingTypeSaveComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogModel<MeetingType>,
    protected service: MeetingTypeService,
    protected frequencyService: MeetingFrequencyService,
    protected snackbar: MatSnackBar,
    protected dialog: MatDialog) {
    super(service, dialog, snackbar);
    this.setFilter();
  }

  setFilter() {
    this.frequencyService.search(new MeetingFrequency()).subscribe( freq => {
      if (freq.status !== 200) {
        this.snackbar.open(freq.errors.error)._dismissAfter(3000);
        return;
      }
      this.frequencies = freq.data.content;
    });
  }

}
