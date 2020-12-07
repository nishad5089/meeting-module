import { Component, EventEmitter, OnInit, Output} from '@angular/core';
import {MatDialog, MatSnackBar} from '@angular/material';
import {SelectionModel} from '@angular/cdk/collections';
import {MasterListComponent} from '../../../../meeting/core/master-list.component';
import {Group} from '../../../../meeting/groups/model/group';
import {GroupService} from '../../../../meeting/groups/service/group.service';

@Component({
  selector: 'app-groups',
  templateUrl: './groups.component.html',
  styleUrls: ['./groups.component.css']
})

export class GroupsComponent extends MasterListComponent<Group> implements OnInit {

  @Output() newGroupsOid = new EventEmitter<Array<string>>();

  selection = new SelectionModel<Group>(true, []);

  groups: Array<Group> = [];
  selectedGroups: Array<Group> = [];
  loading = true;

  constructor(protected service: GroupService,
              protected snackbar: MatSnackBar,
              protected dialog: MatDialog) {
    super(service, dialog, snackbar);
    this.setFilter();
  }

  ngOnInit() {
    super.ngOnInit();
    setTimeout(() => {
      this.getGroups();
    }, 1500);
  }

  getGroups() {
    this.groups = this.dataSource.data;
  }

  updateSelection() {
    const newGroups = this.selectedGroups.map(group => group.oid);
    this.newGroupsOid.emit(newGroups);
  }

  /** Whether the number of selected elements matches the total number of rows. */

  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  masterToggle() {
    this.isAllSelected() ?
      this.makeAllUnSelected() :
      this.makeAllSelected();
  }

  changeSelection(row) {
    if (this.selection.isSelected(row)) {
      this.selectedGroups.splice(this.selectedGroups.indexOf(row), 1);
      this.selection.deselect(row);
    } else {
      this.selectedGroups.push(row);
      this.selection.select(row);
    }
  }

  makeAllUnSelected() {
    this.selection.clear();
    this.dataSource.data.forEach(row => this.selection.deselect(row));
    this.selectedGroups.splice(0, this.selectedGroups.length);
  }

  makeAllSelected() {
    this.selectedGroups.splice(0, this.selectedGroups.length);
    for (let i = 0; i < this.dataSource.data.length; i++) {
      this.selectedGroups.push(this.dataSource.data[i]);
      this.selection.select(this.dataSource.data[i]);
    }
  }


  // keep updating these

  setFilter() {
  }

  setAddModal() {
    // no add
  }

  setEditModal() {
    // no edit
  }

  setTableDetails() {
    this.dto = new Group();
    this.displayColumns = ['checkBox', 'serialNo', 'name', 'description'];
  }

}
