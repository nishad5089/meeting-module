import {Component} from '@angular/core';
import {DialogModel, MasterListComponent} from 'app/meeting/core/master-list.component';
import {MatDialog, MatSnackBar} from '@angular/material';
import {MeetingTypeService} from 'app/meeting/master-settings/meeting-type/service/meeting-type.service';
import {MeetingType} from 'app/meeting/master-settings/meeting-type/model/meeting-type';
import {MeetingTypeSaveComponent} from 'app/meeting/master-settings/meeting-type/component/meeting-type-save/meeting-type-save.component';
import {MeetingFrequency} from '../../../meeting-frequency/model/meeting-frequency';
import {MeetingFrequencyService} from '../../../meeting-frequency/service/meeting-frequency.service';

@Component({
  templateUrl: './meeting-type-list.component.html'
})
export class MeetingTypeListComponent extends MasterListComponent<MeetingType> {
  frequencies: MeetingFrequency[];
  resetVal: boolean;

  constructor(protected service: MeetingTypeService,
              protected snackbar: MatSnackBar,
              protected dialog: MatDialog,
              protected frequencyService: MeetingFrequencyService
  ) {
    super(service, dialog, snackbar);
    this.setFilter();
    this.settingsName = 'মিটিংয়ের ধরন';
  }

  setAddModal() {
    this.dialogAddComponent = MeetingTypeSaveComponent;
    this.dialogAddModel = new DialogModel<MeetingType>();
    this.dialogAddModel.dialogTitle = 'মিটিংয়ের ধরন যোগ করুন​';
    this.dialogAddModel.dto = new MeetingType();
  }

  setEditModal() {
    this.dialogEditComponent = MeetingTypeSaveComponent;
    this.dialogEditModel = new DialogModel<MeetingType>();
    this.dialogEditModel.dialogTitle = 'মিটিংয়ের ধরন সম্পাদনকরণ​';
  }

  setFilter() {
    this.frequencyService.search(new MeetingFrequency()).subscribe(freq => {
      if (freq.status !== 200) {
        this.snackbar.open(freq.errors.error)._dismissAfter(3000);
        return;
      }
      this.frequencies = freq.data.content;
    });
  }

  setTableDetails() {
    this.dto = new MeetingType();
    this.resetVal = true;
    this.displayColumns = ['sl', 'typeName', 'meetingFrequency', 'description', 'actions'];
    this.addButtonTooltips = 'মিটিংয়ের ধরন যোগ করুন​';
  }

  getFrequency(frequencyOid: any) {
    if (this.frequencies !== undefined) {
      const freq = this.frequencies.filter(x => x.oid === frequencyOid)[0];
      if (freq !== undefined) {
        return freq.frequency;
      }
    }
    return '';
  }

  setMeetingFrequency(frequency: MeetingFrequency) {
    this.resetVal = false;
    if (frequency === null) {
      this.dto.frequencyOid = undefined;
      return;
    }
    this.dto.frequencyOid = frequency.oid;
  }

  search(dto: MeetingType) {
    this.resetVal = false;
    super.search(dto);
  }
}
