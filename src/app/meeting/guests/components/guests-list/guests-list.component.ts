import {Component, OnInit} from '@angular/core';
import {GuestsService} from 'app/meeting/guests/service/guests.service';
import {Guest} from 'app/meeting/guests/models/guest';
import {MatDialog, MatSnackBar} from '@angular/material';
import {AddGuestComponent} from 'app/shared/add-guest/add-guest.component';
import {DialogModel, MasterListComponent} from 'app/meeting/core/master-list.component';
import {Settings} from 'app/meeting/guests/settings/model/settings';
import {HTTP_STATUS_OK} from '../../../service/meeting.service';
import {ACTION_ADD_GUEST, ACTION_DELETE_GUEST, ACTION_EDIT_GUEST} from '../../../../constant/action-tags';
import {info_message, success_message} from '../../../../constant/messages';

@Component({
  templateUrl: './guests-list.component.html',
})
export class GuestsListComponent extends MasterListComponent<Guest> implements OnInit {

  actionTagAddGuest = ACTION_ADD_GUEST;
  actionTagEditGuest = ACTION_EDIT_GUEST;
  actionTagDeleteGuest = ACTION_DELETE_GUEST;

  guests: Array<Guest>;
  resetVal: boolean;

  constructor(protected service: GuestsService,
              protected snackbar: MatSnackBar,
              protected deleteDialog: MatDialog
  ) {
    super(service, deleteDialog, snackbar);
    this.setFilter();
    this.settingsName = 'অতিথি';
  }

  ngOnInit() {
    this.search(this.dto);
    setTimeout(() => {
    }, 1000);
  }

  search(dto: Guest) {
    this.resetVal = false;
    super.search(dto);
  }

  setTableDetails() {
    this.dto = new Guest();
    this.displayColumns = ['sl', 'name', 'nameInBangla', 'office', 'department', 'designation', 'email', 'phone', 'actions'];
    this.addButtonTooltips = info_message.ADD_GUEST;
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

  reset() {
    this.dto = new Guest();
    this.setFilter();
  }

  setFilter() {
    this.resetVal = true;
  }

  setAddModal() {
    this.dialogAddComponent = AddGuestComponent;
    this.dialogAddModel = new DialogModel<Guest>();
    this.dialogAddModel.dto = new Guest();
    this.dialogAddModel.dialogTitle = info_message.ADD_GUEST_MODAL;
  }

  setEditModal() {
    this.dialogEditComponent = AddGuestComponent;
    this.dialogEditModel = new DialogModel<Guest>();
    this.dialogEditModel.dialogTitle = info_message.EDIT_GUEST_MODAL;
  }

  update(dto: Guest) {
    try {
      this.dialogEditModel.dto = dto;
      this.dialog.open(this.dialogEditComponent, {
        width: '60%',
        data: this.dialogEditModel
      }).afterClosed().subscribe(result => {
        if (result !== undefined) {
          const guest = new Guest();
          guest.oid = result.oid;
          guest.nameBn = result.nameBn;
          guest.nameEn = result.nameEn;
          guest.organizationOid = result.organizationOid;
          guest.officeOid = result.officeOid;
          guest.designationOid = result.designationOid;
          guest.departmentOid = result.departmentOid;
          guest.emailAddress = result.emailAddress;
          guest.contactNo = result.contactNo;
          guest.pictureFile = result.pictureFile;
          guest.signatureFile = result.signatureFile;
          if (result.office) {
            guest.office = result.office;
          }
          if (result.department) {
            guest.department = result.department;
          }
          if (result.designation) {
            guest.designation = result.designation;
          }
          this.service.update(guest).subscribe(response => {
            if (response.status !== HTTP_STATUS_OK) {
              this.snackbar.open(response.errors)._dismissAfter(3000);
              return;
            }
            this.snackbar.open(success_message.UPDATED_SUCCESSFULLY)._dismissAfter(3000);
            this.search(this.dto);
          });
        }
      });
    } catch (e) {
      console.log(e);
    }
  }
}
