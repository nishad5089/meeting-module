import {Component} from '@angular/core';
import {MatDialog, MatSnackBar} from '@angular/material';
import {Group} from '../../../../../app/meeting/groups/model/group';
import {GroupService} from '../../../../../app/meeting/groups/service/group.service';
import {Router} from '@angular/router';
import {DialogModel, MasterListComponent} from '../../../../../app/meeting/core/master-list.component';
import {GroupModalComponent} from '../../../../../app/meeting/groups/component/group-modal/group-modal.component';
import {GroupDetailsComponent} from '../group-details/group-details.component';
import {AuthenticationService} from '../../../../shared/security/service/authentication.service';
import {ACTION_ADD_GROUP, ACTION_DELETE_GROUP, ACTION_EDIT_GROUP} from '../../../../constant/action-tags';
import {info_message} from '../../../../constant/messages';

@Component({
  templateUrl: './group-list.component.html',
})

export class GroupListComponent extends MasterListComponent<Group> {


  actionTagAddGroup = ACTION_ADD_GROUP;
  actionTagEditGroup = ACTION_EDIT_GROUP;
  actionTagDeleteGroup = ACTION_DELETE_GROUP;

  constructor(protected service: GroupService,
              protected dialog: MatDialog,
              protected snackbar: MatSnackBar,
              protected router: Router,
              protected authenticationService: AuthenticationService) {
    super(service, dialog, snackbar);
    this.settingsName = 'গ্রুপ';
  }

  setAddModal() {
    this.dialogAddComponent = GroupModalComponent;
    this.dialogAddModel = new DialogModel<Group>();
    this.dialogAddModel.dialogTitle = info_message.ADD_GROUP_MODAL;
    this.dialogAddModel.dto = new Group();
  }

  setEditModal() {
    this.dialogEditComponent = GroupModalComponent;
    this.dialogEditModel = new DialogModel<Group>();
    this.dialogEditModel.dialogTitle = info_message.EDIT_GROUP_MODAL;
  }

  setFilter() {
  }

  setTableDetails() {
    this.dto = new Group();
    this.dto.status = 'active';
    this.displayColumns = ['sl', 'groupName', 'description', 'actions'];
    this.addButtonTooltips = info_message.ADD_GROUP;
  }

  goToDetails(dto: Group) {
    GroupDetailsComponent.group = dto;
    this.router.navigateByUrl('/meetings/groups/details/' + dto.oid);
  }

  applyFilter(filterValue: string) {
    this.dataSource.filterPredicate = (data, filter: string) => {
      const str = data.groupName + data.description;
      return str.toLowerCase().indexOf(filter) !== -1;
    };
    super.applyFilter(filterValue);
  }

}
