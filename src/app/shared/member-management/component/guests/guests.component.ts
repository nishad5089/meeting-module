import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {MatDialog, MatSnackBar} from '@angular/material';
import {SelectionModel} from '@angular/cdk/collections';
import {Guest} from '../../../../meeting/guests/models/guest';
import {GuestsService} from '../../../../meeting/guests/service/guests.service';
import {Settings} from '../../../../meeting/guests/settings/model/settings';
import {MasterListComponent} from '../../../../meeting/core/master-list.component';

@Component({
  selector: 'app-guests',
  templateUrl: './guests.component.html',
  styleUrls: ['./guests.component.css']
})

export class GuestsComponent extends MasterListComponent<Guest> implements OnInit {

  @Input() guestsOid: Array<string>;
  @Output() newGuestsOid = new EventEmitter<Array<string>>();

  selection = new SelectionModel<Guest>(true, []);

  selectedGuests: Array<Guest> = [];
  guestList: Array<Guest> = [];
  isCheckboxDisabled: Array<boolean> = [];
  loading = true;
  resetVal: boolean;

  constructor(protected service: GuestsService,
              protected snackbar: MatSnackBar,
              protected dialog: MatDialog) {
    super(service, dialog, snackbar);
    this.setFilter();
  }

  ngOnInit() {
    super.ngOnInit();
  }

  search(dto: Guest) {
    this.resetVal = false;
    super.search(dto);
  }

  searchCallback() {
    this.checkSelected();
  }

  isCheckedDisabled(guest: Guest): boolean {
    if (this.dataSource.data === undefined
      || this.dataSource.data.length === 0
      || this.guestsOid === undefined
      || this.guestsOid.length === 0) {
      return false;
    }
    return this.guestsOid.includes(guest.oid);
  }

  updateSelection() {
    const newGuests = this.selectedGuests.map(guest => guest.oid);
    this.newGuestsOid.emit(newGuests);
  }

  /** Whether the number of selected elements matches the total number of rows. */
  isAllSelected() {
    return this.dataSource.data.length === this.selection.selected.length + this.guestsOid.length;
  }

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  masterToggle() {
    this.isAllSelected() ?
      this.makeAllUnSelected() :
      this.makeAllSelected();
  }

  changeSelection(row) {
    if (this.selection.isSelected(row)) {
      this.selectedGuests.splice(this.selectedGuests.indexOf(row), 1);
      this.selection.deselect(row);
    } else {
      this.selectedGuests.push(row);
      this.selection.select(row);
    }
  }

  makeAllUnSelected() {
    this.selection.clear();
    this.dataSource.data.forEach(row => this.selection.deselect(row));
    this.selectedGuests = [];
  }

  makeAllSelected() {
    this.selectedGuests = [];
    this.dataSource.data.forEach(x => {
      if (this.isCheckedDisabled(x) === false) {
        this.selectedGuests.push(x);
        this.selection.select(x);
      }
    });
  }

  checkSelected() {
    this.guestList = this.dataSource.data;
    this.isCheckboxDisabled = [];
    for (let i = 0; i < this.guestList.length; i++) {
      this.isCheckboxDisabled.push(false);
    }
    for (let i = 0; i < this.guestList.length; i++) {
      for (let j = 0; j < this.guestsOid.length; j++) {
        if (this.guestList[i].oid === this.guestsOid[j]) {
          this.isCheckboxDisabled[i] = true;
          break;
        }
      }
    }
    this.loading = false;
  }

  setGuestOffice(settings: Settings) {
    this.resetVal = false;
    if (!settings) {
      this.dto.officeOid = '';
      return;
    }
    this.dto.officeOid = settings.oid;
  }

  setGuestDepartment(settings: Settings) {
    this.resetVal = false;
    if (!settings) {
      this.dto.departmentOid = '';
      return;
    }
    this.dto.departmentOid = settings.oid;
  }

  setGuestDesignation(settings: Settings) {
    this.resetVal = false;
    if (!settings) {
      this.dto.designationOid = '';
      return;
    }
    this.dto.designationOid = settings.oid;
  }

  unsetGuestOffice(value: string) {
    if (value === '') {
      this.dto.officeOid = undefined;
    }
  }

  unsetGuestDepartment(value: string) {
    if (value === '') {
      this.dto.departmentOid = undefined;
    }
  }

  unsetGuestDesignation(value: string) {
    if (value === '') {
      this.dto.designationOid = undefined;
    }
  }

  // keep updating these

  setAddModal() {
    // no add
  }

  setEditModal() {
    // no edit
  }

  setFilter() {
    this.resetVal = true;
  }

  setTableDetails() {
    this.dto = new Guest();
    this.displayColumns = ['checkBox', 'sl', 'name', 'nameInBangla', 'organization',
      'office', 'designation', 'department', 'email', 'phone'];
  }

  reset() {
    super.reset();
    this.setFilter();
  }

}
