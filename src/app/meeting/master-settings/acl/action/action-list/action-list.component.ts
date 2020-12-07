import {Component, OnInit} from '@angular/core';
import {DialogModel, MasterListComponent} from '../../../../core/master-list.component';
import {Action} from '../model/action';
import {ActionService} from '../service/action.service';
import {MatDialog, MatSnackBar} from '@angular/material';
import {ActionCreateComponent} from '../action-create/action-create.component';


@Component({
  templateUrl: './action-list.component.html'
})

export class ActionListComponent extends MasterListComponent<Action> implements OnInit {

  constructor(protected service: ActionService,
              protected snackbar: MatSnackBar,
              protected dialog: MatDialog
  ) {
    super(service, dialog, snackbar);
    this.dto = new Action();
    this.settingsName = 'অ্যাকশন ট্যাগ';
  }

  ngOnInit() {
    super.ngOnInit();

    setTimeout(() => {
    }, 1500);
  }

  setAddModal() {
    this.dialogAddComponent = ActionCreateComponent;
    this.dialogAddModel = new DialogModel<Action>();
    this.dialogAddModel.dialogTitle = 'অ্যাকশন ট্যাগ যুক্তকরণ​';
    this.dialogAddModel.dto = new Action();
  }

  setEditModal() {
    this.dialogEditComponent = ActionCreateComponent;
    this.dialogEditModel = new DialogModel<Action>();
    this.dialogEditModel.dialogTitle = 'অ্যাকশন ট্যাগ সম্পাদনকরণ';
  }

  setFilter() {
  }

  setTableDetails() {
    this.displayColumns = ['sl', 'actionEn', 'actionBn', 'actionTag', 'description', 'actions'];
    this.addButtonTooltips = 'অ্যাকশন ট্যাগ যোগ করুন​';
  }

}
