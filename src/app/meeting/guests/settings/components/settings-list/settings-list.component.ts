import {Component, OnDestroy, OnInit} from '@angular/core';
import {Settings} from '../../model/settings';
import {SettingsService} from '../../service/settings.service';
import {MatDialog, MatSnackBar} from '@angular/material';
import {DialogModel, MasterListComponent} from '../../../../core/master-list.component';
import {SettingsSaveComponent} from '../settings-save/settings-save.component';
import {
  ACTION_ADD_GUEST_SETTINGS,
  ACTION_DELETE_GUEST_SETTINGS,
  ACTION_EDIT_GUEST_SETTINGS
} from '../../../../../constant/action-tags';


@Component({
  templateUrl: './settings-list.component.html',
})

export class SettingsListComponent extends MasterListComponent<Settings> implements OnInit, OnDestroy {

  actionTagAddGuestSettings = ACTION_ADD_GUEST_SETTINGS;
  actionTagEditGuestSettings = ACTION_EDIT_GUEST_SETTINGS;
  actionTagDeleteGuestSettings = ACTION_DELETE_GUEST_SETTINGS;

  dialogTitle: string = '';
  type: string = '';
  types: Array<{nameEn: string, nameBn: string}> = [
    {nameEn: 'Office', nameBn: 'অফিস'},
    {nameEn: 'Department', nameBn: 'বিভাগ'},
    {nameEn: 'Designation', nameBn: 'পদবি'}];

  speedDialFabButtons = [
    {
      icon: 'account_balance',
      tooltip: 'অফিস যোগ করুন',
      show: true
    },
    {
      icon: 'card_membership',
      tooltip: 'বিভাগ যোগ করুন',
      show: true
    },
    {
      icon: 'class',
      tooltip: 'পদবি যোগ করুন',
      show: true
    }
  ];

  constructor(public dialog: MatDialog,
              public  service: SettingsService,
              public  snackbar: MatSnackBar) {
    super(service, dialog, snackbar);
  }

  ngOnInit() {
    this.settingsName = 'অতিথি সেটিংস';
    this.search(this.dto);
  }

  onSpeedDialFabClicked(btn: { icon: string }) {
    // console.log(btn);
    if (btn.icon === 'card_membership') {
      this.dialogTitle = 'বিভাগ যোগ করুন';
      this.type = 'Department';
    } else if (btn.icon === 'class') {
      this.dialogTitle = 'পদবি যোগ করুন';
      this.type = 'Designation';
    } else if (btn.icon === 'account_balance') {
      this.dialogTitle = 'অফিস যোগ করুন';
      this.type = 'Office';
    }
    this.setAddModal();
    this.add();
  }


  ngOnDestroy(): void {
    this.dialogAddComponent = null;
    this.dto = null;
    this.dialogAddModel = null;
  }

  setAddModal() {
    this.dialogAddComponent = SettingsSaveComponent;
    this.dialogAddModel = new DialogModel<Settings>();
    this.dialogAddModel.dto = new Settings();
    this.dialogAddModel.dto.fieldType = this.type;
    this.dialogAddModel.dialogTitle = this.dialogTitle;
  }

  setEditModal() {
    this.dialogEditComponent = SettingsSaveComponent;
    this.dialogEditModel = new DialogModel<Settings>();
    this.dialogEditModel.dialogTitle = 'সম্পাদনকরণ';
  }

  setFilter() {
  }

  setTableDetails() {
    this.dto = new Settings();
    this.displayColumns = ['sl', 'type', 'bn', 'en', 'action'];
  }

  applyFilter(filterValue: string) {
    this.dataSource.filterPredicate = (data, filter: string) => {
      const str = this.getFieldBn(data.fieldType)
        + data.fieldNameBn + data.fieldNameEn;
      return str.toLowerCase().indexOf(filter) !== -1;
    };
    super.applyFilter(filterValue);
  }

  getFieldBn(nameEn: string): string {
    const items = this.types.filter(x => x.nameEn === nameEn);
    return items && items.length > 0 ? items[0].nameBn : '';
  }
}
