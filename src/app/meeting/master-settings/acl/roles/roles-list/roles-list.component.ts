import {DialogModel, MasterListComponent} from '../../../../core/master-list.component';
import {Roles} from '../model/roles';
import {Component, OnInit} from '@angular/core';
import {RolesService} from '../service/roles.service';
import {MatDialog, MatSnackBar} from '@angular/material';
import {RolesCreateComponent} from '../roles-create/roles-create.component';


@Component({
  templateUrl: 'roles-list.component.html'
})

export class RolesListComponent extends MasterListComponent<Roles> implements OnInit {

  roles: Roles[];

  constructor(protected service: RolesService,
              protected snackbar: MatSnackBar,
              protected dialog: MatDialog) {
    super(service, dialog, snackbar);
    this.dto = new Roles();
    this.settingsName = 'রোল';
  }

  ngOnInit() {
    super.ngOnInit();

    setTimeout(() => {
    }, 1500);
  }

  setAddModal() {
    this.dialogAddComponent = RolesCreateComponent;
    this.dialogAddModel = new DialogModel<Roles>();
    this.dialogAddModel.dialogTitle = 'রোল যুক্তকরণ​';
    this.dialogAddModel.dto = new Roles();
  }

  setEditModal() {
    this.dialogEditComponent = RolesCreateComponent;
    this.dialogEditModel = new DialogModel<Roles>();
    this.dialogEditModel.dialogTitle = 'রোল সম্পাদনকরণ';
  }

  setFilter() {
  }

  setTableDetails() {
    this.displayColumns = ['sl', 'roleBn', 'roleEn', 'roleTag', 'description', 'actions'];
    this.addButtonTooltips = 'রোল যোগ করুন​';
  }


}
