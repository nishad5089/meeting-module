import {Component} from '@angular/core';
import {DialogModel, MasterListComponent} from '../../../../../../core/master-list.component';
import {UserRoles} from '../../../model/user-roles';
import {MatSnackBar} from '@angular/material/snack-bar';
import {MatDialog} from '@angular/material/dialog';
import {UserRolesService} from '../../../service/user-roles.service';
import {MeetingCreatorCreateComponent} from '../meeting-creator-create/meeting-creator-create.component';
import {roles} from '../../../../../../../constant/roles.constant';

@Component({
  selector: 'app-meeting-creator',
  templateUrl: './meeting-creator-list.component.html',
})
export class MeetingCreatorListComponent extends MasterListComponent<UserRoles> {
  constructor(protected service: UserRolesService,
              protected snackbar: MatSnackBar,
              protected dialog: MatDialog) {
    super(service, dialog, snackbar);
    this.dto = new UserRoles();
    this.dto.roleTag = roles.MEM_MEETING_CREATOR;
    this.settingsName = 'মিটিং ক্রিয়েটর';
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
    this.dialogAddComponent = MeetingCreatorCreateComponent;
    this.dialogAddModel = new DialogModel<UserRoles>();
    this.dialogAddModel.dialogTitle = 'মিটিং ক্রিয়েটর যুক্তকরণ​';
    this.dialogAddModel.dto = new UserRoles();
  }

  setEditModal() {
    this.dialogEditComponent = MeetingCreatorCreateComponent;
    this.dialogEditModel = new DialogModel<UserRoles>();
    this.dialogEditModel.dialogTitle = 'মিটিং ক্রিয়েটর সম্পাদনকরণ';
  }

  setFilter() {
  }

  setTableDetails() {
    this.displayColumns = ['sl', 'creatorName', 'actions'];
    this.addButtonTooltips = 'মিটিং ক্রিয়েটর যোগ করুন​';
  }

  applyFilter(filterValue: string) {
    this.dataSource.filterPredicate = (data, filter: string) => {
      const str = data.employee.name + data.employee.designationName + data.employee.departmentName + data.employee.orgName;
      return str.toLowerCase().indexOf(filter) !== -1;
    };
    super.applyFilter(filterValue);
  }
}
