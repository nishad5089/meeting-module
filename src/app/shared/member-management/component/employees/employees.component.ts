import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {MatDialog, MatSnackBar} from '@angular/material';
import {SelectionModel} from '@angular/cdk/collections';
import {Settings} from '../../../../meeting/guests/settings/model/settings';
import {MasterListComponent} from '../../../../meeting/core/master-list.component';
import {Employee} from '../../../../meeting/model/employee';
import {OrganogramService} from '../../../service/organogram.service';
import {settings} from '../../../../constant/settings-type';
import {EmployeeService} from '../../../service/employee.service';

@Component({
  selector: 'app-employees',
  templateUrl: './employees.component.html',
  styleUrls: ['./employees.component.css']
})

export class EmployeesComponent extends MasterListComponent<Employee> implements OnInit {


  @Input() employeesOid: Array<string>;
  @Output() newEmployeesOid = new EventEmitter<Array<string>>();

  selection = new SelectionModel<Employee>(true, []);

  selectedEmployees: Array<Employee> = [];
  resetVal: boolean;

  constructor(protected service: EmployeeService,
              protected snackbar: MatSnackBar,
              protected dialog: MatDialog) {
    super(service, dialog, snackbar);
    this.setFilter();
  }

  ngOnInit() {
    super.ngOnInit();
  }

  updateSelection() {
    const newEmployees = this.selectedEmployees.map(employee => employee.oid);
    this.newEmployeesOid.emit(newEmployees);
  }

  /** Whether the number of selected elements matches the total number of rows. */
  isAllSelected() {
    let count = 0;
    const numSelected = this.selection.selected.length;

    this.dataSource.data.forEach(x => {
      if (this.isCheckedDisabled(x) === false) {
        count = count + 1;
      }
    });
    return numSelected === count;
  }

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  masterToggle() {
    this.isAllSelected() ?
      this.makeAllUnSelected() :
      this.makeAllSelected();
  }

  changeSelection(row) {
    if (this.selection.isSelected(row)) {
      this.selectedEmployees.splice(this.selectedEmployees.indexOf(row), 1);
      this.selection.deselect(row);
    } else {
      this.selectedEmployees.push(row);
      this.selection.select(row);
    }
  }

  makeAllUnSelected() {
    this.selection.clear();
    this.dataSource.data.forEach(row => this.selection.deselect(row));
    this.selectedEmployees.splice(0, this.selectedEmployees.length);
  }

  makeAllSelected() {
    this.selectedEmployees.splice(0, this.selectedEmployees.length);

    this.dataSource.data.forEach(x => {
      if (this.isCheckedDisabled(x) === false) {
        this.selectedEmployees.push(x);
        this.selection.select(x);
      }
    });
  }

  isCheckedDisabled(employee: Employee): boolean {
    if (this.dataSource.data === undefined
      || this.dataSource.data.length === 0
      || this.employeesOid === undefined
      || this.employeesOid.length === 0) {
      return false;
    }
    return this.employeesOid.includes(employee.oid);
  }

  // keep updating these

  setAddModal() {
    // no add
  }

  setEditModal() {
    // no edit
  }

  search(dto: Employee) {
    if (!dto.name) {
      dto.name = '';
    }
    this.resetVal = false;
    super.search(dto);
  }

  setFilter() {
    this.resetVal = true;
  }

  reset() {
    super.reset();
    this.setFilter();
  }

  setTableDetails() {
    this.dto = new Employee();
    this.dto.name = '';
    this.displayColumns = ['checkBox', 'serialNo', 'name', 'nameInBangla', 'office',
      'department', 'designation', 'email', 'phone', 'profilePicture'];
  }
  setOffice(office: Settings) {
    this.resetVal = false;
    if (office === null) {
      this.dto.officeOid = '';
      this.dto.departmentOid = '';
      this.dto.designationOid = '';
      return;
    }
    this.dto.officeOid = office.oid;
  }

  setDepartment(department: Settings) {
    this.resetVal = false;
    if (department === null) {
      this.dto.departmentOid = '';
      this.dto.designationOid = '';
      return;
    }
    this.dto.departmentOid = department.oid;
  }

  setDesignation(designation: Settings) {
    this.resetVal = false;
    if (designation === null) {
      this.dto.designationOid = '';
      return;
    }
    this.dto.designationOid = designation.oid;
  }

}
