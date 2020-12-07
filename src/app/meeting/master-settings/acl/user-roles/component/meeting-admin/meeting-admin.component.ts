import {Component} from '@angular/core';
import {MasterListComponent} from '../../../../../core/master-list.component';
import {UserRoles} from '../../model/user-roles';
import {UserRolesService} from '../../service/user-roles.service';
import {MatSnackBar} from '@angular/material/snack-bar';
import {MatDialog} from '@angular/material/dialog';
import {roles} from '../../../../../../constant/roles.constant';

@Component({
  selector: 'app-meeting-admin',
  templateUrl: 'meeting-admin.component.html'
})
export class MeetingAdminComponent extends MasterListComponent<UserRoles> {
  constructor(protected service: UserRolesService,
              protected snackbar: MatSnackBar,
              protected dialog: MatDialog) {
    super(service, dialog, snackbar);
    this.dto = new UserRoles();
    this.dto.roleTag = roles.MEM_MEETING_ADMIN;
    this.settingsName = 'মিটিং অ্যাডমিন';
  }

  displayFn(element?): string {
    if (element.employee) {
      let name = element.employee.name;
      if (element.employee.designationName && element.employee.designationName.length > 0) {
        name += ', ' + element.employee.designationName;
      }
      if (element.employee.departmentName && element.employee.departmentName.length > 0) {
        name += ', ' + element.employee.departmentName;
      }
      if (element.employee.orgName && element.employee.orgName.length > 0) {
        name += ', ' + element.employee.orgName;
      }
      return name;
    }
  }

  setAddModal() {
    /*this.dialogAddComponent = MeetingCreatorCreateComponent;
    this.dialogAddModel = new DialogModel<UserRoles>();
    this.dialogAddModel.dialogTitle = 'মিটিং ক্রিয়েটর যুক্তকরণ​';
    this.dialogAddModel.dto = new UserRoles();*/
  }

  setEditModal() {
    /*this.dialogEditComponent = MeetingCreatorCreateComponent;
    this.dialogEditModel = new DialogModel<UserRoles>();
    this.dialogEditModel.dialogTitle = 'মিটিং ক্রিয়েটর সম্পাদনকরণ';*/
  }

  setFilter() {
  }

  setTableDetails() {
    this.displayColumns = ['sl', 'adminName'];
    // this.addButtonTooltips = 'মিটিং ক্রিয়েটর যোগ করুন​';
  }

  applyFilter(filterValue: string) {
    this.dataSource.filterPredicate = (data, filter: string) => {
      const str = data.employee.name + data.employee.designationName + data.employee.departmentName + data.employee.orgName;
      return str.toLowerCase().indexOf(filter) !== -1;
    };
    super.applyFilter(filterValue);
  }
}
