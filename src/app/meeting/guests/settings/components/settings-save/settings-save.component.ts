import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';
import {Settings} from 'app/meeting/guests/settings/model/settings';
import {DialogModel} from '../../../../core/master-list.component';

@Component({
  templateUrl: './settings-save.component.html'
})
export class SettingsSaveComponent  implements OnInit {

  constructor(
    public dialog: MatDialogRef<SettingsSaveComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogModel<Settings>) { }

  ngOnInit() {
  }

  cancel() {
    this.dialog.close();
  }
}
