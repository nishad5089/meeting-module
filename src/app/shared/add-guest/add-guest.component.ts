import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef, MatSnackBar} from '@angular/material';
import {Guest} from '../../meeting/guests/models/guest';
import {Settings} from '../../meeting/guests/settings/model/settings';
import {MeetingInvitee} from '../../meeting/model/meeting-invitee';
import {GuestsService} from '../../meeting/guests/service/guests.service';
import {SettingsService} from '../../meeting/guests/settings/service/settings.service';
import {FileManagementService} from '../../meeting/service/file-management.service';
import {DialogModel} from '../../meeting/core/master-list.component';
import {roles} from '../../constant/roles.constant';
import {InviteeService} from '../../meeting/meeting-details/service/invitees.service';
import {guest_settings} from '../../constant/settings-type';
import * as _ from 'lodash';
import {environment} from '../../../environments/environment';

@Component({
  templateUrl: './add-guest.component.html',
})
export class AddGuestComponent implements OnInit {

  guestOrganization: Settings;
  guestOffice: Settings;
  guestDepartment: Settings;
  guestDesignation: Settings;

  guest = new Guest();

  meetingOid: string;
  memberList: Array<MeetingInvitee>;
  proPic: File;
  sigPic: File;
  isLoadingResults: any;

  constructor(
    public dialogRef: MatDialogRef<AddGuestComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogModel<Guest>,
    protected service: GuestsService,
    protected snackbar: MatSnackBar,
    protected inviteesService: InviteeService
  ) {
    environment.IS_MODAL_OPEN = true;
  }

  ngOnInit() {
    this.guest = _.cloneDeep(this.data.dto);

    if (this.data.dto.organizationOid) {
      this.guestOrganization = new Settings();
      this.guestOrganization.oid = this.data.dto.organizationOid;
      this.guestOrganization.fieldNameBn = this.data.dto.orgName;
    }
    if (this.data.dto.officeOid) {
      this.guestOffice = new Settings();
      this.guestOffice.oid = this.data.dto.officeOid;
      this.guestOffice.fieldNameBn = this.data.dto.officeName;
    }
    if (this.data.dto.departmentOid) {
      this.guestDepartment = new Settings();
      this.guestDepartment.oid = this.data.dto.departmentOid;
      this.guestDepartment.fieldNameBn = this.data.dto.departmentName;
    }
    if (this.data.dto.designationOid) {
      this.guestDesignation = new Settings();
      this.guestDesignation.oid = this.data.dto.designationOid;
      this.guestDesignation.fieldNameBn = this.data.dto.designationName;
    }
  }

  /*save() {
    if (this.data.dto.contactNo === undefined && this.data.dto.emailAddress === undefined) {
      this.snackbar.open('অতিথির ই-মেইল অথবা মোবাইল নাম্বার অবশ্যই দিতে হবে')._dismissAfter(3000);
    } else {
      console.log('inside save method');
      const formData = new FormData();
      if (this.proPic !== undefined && this.proPic !== null) {
        formData.append('file', this.proPic);
        formData.append('title', 'Profile Picture');
        formData.append('attachmentType', 'picture');
      }

      if (this.sigPic !== undefined && this.sigPic !== null) {
        formData.append('file', this.sigPic);
        formData.append('title', 'Signature');
        formData.append('attachmentType', 'signature');
      }
      if (formData.get('file') !== null) {
        formData.append('personOid', 'new_guest');
        // formData.append('createdBy', this.authenticationService.currentUserValue.employeeId);
        this.fileManagementService.picOrSigUpload(formData).subscribe(res => {
          if (res.status !== 200) {
            console.log('pic upload failed');
            return;
          }
          res.data.forEach(x => {
            if (x.attachmentType === 'signature') {
              this.data.dto.signatureFile = x.fileOid;
            } else if (x.attachmentType === 'picture') {
              this.data.dto.pictureFile = x.fileOid;
            }
          });
          this.saveGuest();
          this.dialogRef.close(this.data.dto);
          return;
        });
      } else {
        this.saveGuest();
        this.dialogRef.close(this.data.dto);
      }
    }
  }*/


  show(event, type: string) {
    if (type === 'pro') {
      this.proPic = event['srcElement'].files[0];
    } else {
      this.sigPic = event['srcElement'].files[0];
    }
  }

  /*saveGuest() {
    console.log(JSON.stringify(this.data.dto));
    this.service.create(this.data.dto).subscribe(response => {
      if (response.status !== 200) {
        this.snackbar.open(response.errors)._dismissAfter(3000);
        return;
      }
      console.log(response);
      if (this.meetingOid === 'default_oid' || this.meetingOid === undefined) {
        this.snackbar.open('অতিথি সফলভাবে তৈরি হয়েছে')._dismissAfter(3000);
        return;
      }
      this.addAsInvitee(response);
    });
  }*/

  validateNameAndContact(guest: Guest): boolean {
    return !!(guest.nameBn && (guest.emailAddress || guest.contactNo));
  }

  validateOfficeAndDesignation(guest: Guest): boolean {
    return !!((guest.officeOid || guest.office) && (guest.designationOid || guest.designation));
  }

  validateAndSave() {
    if (this.validateNameAndContact(this.guest) || this.validateOfficeAndDesignation(this.guest)) {
      environment.IS_MODAL_OPEN = false;
      this.dialogRef.close(this.guest);
    } else {
      this.snackbar.open('দয়া করে ১। নাম এবং মোবাইল অথবা ইমেইল ২। অফিস এবং পদবি সেটদ্বয়ের যেকোন একটি অবশ্যই প্রদান করুন')._dismissAfter(6000);
      return;
    }
  }

  cancel() {
    environment.IS_MODAL_OPEN = false;
    this.dialogRef.close();
  }

  setGuestOffice(settings: Settings) {
    this.guest.officeOid = settings.oid;
    this.guest.office = undefined;
  }

  setGuestDepartment(settings: Settings) {
    this.guest.departmentOid = settings.oid;
    this.guest.department = undefined;
  }

  setGuestDesignation(settings: Settings) {
    this.guest.designationOid = settings.oid;
    this.guest.designation = undefined;
  }

  setNewOffice(value: string) {
    if (value === '') {
      this.guest.office = undefined;
      this.guest.officeOid = '';
      return;
    }
    this.guest.officeOid = undefined;
    this.guest.office = new Settings();
    this.guest.office.fieldNameBn = value;
    this.guest.office.fieldType = guest_settings.office;
  }

  setNewDepartment(value: string) {
    if (value === '') {
      this.guest.department = undefined;
      this.guest.departmentOid = '';
      return;
    }
    this.guest.departmentOid = undefined;
    this.guest.department = new Settings();
    this.guest.department.fieldNameBn = value;
    this.guest.department.fieldType = guest_settings.department;
  }

  setNewDesignation(value: string) {
    if (value === '') {
      this.guest.designation = undefined;
      this.guest.designationOid = '';
      return;
    }
    this.guest.designationOid = undefined;
    this.guest.designation = new Settings();
    this.guest.designation.fieldNameBn = value;
    this.guest.designation.fieldType = guest_settings.designation;
  }

  addAsInvitee(response) {
    const length = this.memberList.length;
    const invitee = new MeetingInvitee();
    invitee.inviteeType = 'guest';
    invitee.meetingOid = this.meetingOid;
    invitee.memberOid = response.data.oid;
    invitee.serialNo = length + 1;
    invitee.organizationOid = response.data.organizationOid;
    invitee.attendeeResponseStatus = 'pending';
    invitee.nominationCapabilityStatus = 'no';
    invitee.invitationStatus = '';
    invitee.ownershipStatus = roles.MEM_MEETING_MEMBER;
    invitee.acknowledgementStatus = 'no';
    invitee.honorariumStatus = 'no';
    invitee.workingPaperRequirement = 'no';
    invitee.nominatedBy = '';
    invitee.signingAuthority = 'no';
    invitee.updatedBy = '';
    invitee.includeStatus = 'no';
    invitee.status = 'active';
    invitee.notificationStatus = 'no';
    // invitee.createdBy = this.authenticationService.currentUserValue.employeeId;
    this.inviteesService.create(invitee).subscribe(resp => {
      if (resp.status !== 200) {
        return;
      }
      this.snackbar.open('অতিথি সফলভাবে যোগ হয়েছে')._dismissAfter(3000);
    });
  }

}
