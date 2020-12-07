import {Component, OnInit} from '@angular/core';
import {DialogModel, MasterListComponent} from '../../../core/master-list.component';
import {Building} from '../model/building';
import {MatDialog, MatSnackBar} from '@angular/material';
import {BuildingService} from '../service/building.service';
import {BuildingCreateComponent} from '../building-create/building-create.component';

@Component({
  templateUrl: './building-list.component.html'
})

export class BuildingListComponent extends MasterListComponent<Building> {

  constructor(protected service: BuildingService,
              protected snackbar: MatSnackBar,
              protected dialog: MatDialog
  ) {
    super(service, dialog, snackbar);
    this.dto = new Building();
    this.settingsName = 'ভবন';
  }

  setAddModal() {
    this.dialogAddComponent = BuildingCreateComponent;
    this.dialogAddModel = new DialogModel<Building>();
    this.dialogAddModel.dialogTitle = 'মিটিংয়ের ভবন যুক্তকরণ​';
    this.dialogAddModel.dto = new Building();
  }

  setEditModal() {
    this.dialogEditComponent = BuildingCreateComponent;
    this.dialogEditModel = new DialogModel<Building>();
    this.dialogEditModel.dialogTitle = 'মিটিংয়ের ভবন সম্পাদনকরণ';
  }

  setFilter() {
  }

  setTableDetails() {
    this.dto = new Building();
    this.displayColumns = ['sl', 'buildingName', 'address', 'actions'];
    this.addButtonTooltips = 'মিটিংয়ের ভবন যোগ করুন​';
  }

}
