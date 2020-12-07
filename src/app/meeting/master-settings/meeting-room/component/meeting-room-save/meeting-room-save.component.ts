import {Component, Inject, OnInit} from '@angular/core';
import {MasterAddComponent} from 'app/meeting/core/master-add.component';
import {MeetingRoom} from 'app/meeting/master-settings/meeting-room/model/meeting-room';
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef, MatSnackBar} from '@angular/material';
import {DialogModel} from 'app/meeting/core/master-list.component';
import {MeetingRoomService} from 'app/meeting/master-settings/meeting-room/service/meeting-room.service';
import {Building} from '../../../building/model/building';
import {SharedRoom} from '../../model/shared-room';
import {AuthenticationService} from '../../../../../shared/security/service/authentication.service';
import {MatTableDataSource} from '@angular/material/table';
import {Settings} from '../../../../guests/settings/model/settings';
import {OrganogramService} from '../../../../../shared/service/organogram.service';
import {SelectionModel} from '@angular/cdk/collections';
import {END_POINT_DELETE} from '../../../../../constant/api';

@Component({
  templateUrl: './meeting-room-save.component.html',
})
export class MeetingRoomSaveComponent extends MasterAddComponent<MeetingRoom> implements OnInit {

  building: Building;
  offices: Array<Settings> = [];
  selectedOfficesOid: Array<string> = [];

  dataSource: MatTableDataSource<Settings>;
  selection = new SelectionModel<Settings>(true, []);
  displayedColumnsOfOffice: string[] = ['checkBox', 'sl', 'officeName'];
  isLoadingResults: boolean = true;

  constructor(
    public dialogRef: MatDialogRef<MeetingRoomSaveComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogModel<MeetingRoom>,
    protected service: MeetingRoomService,
    protected snackbar: MatSnackBar,
    protected dialog: MatDialog,
    protected authenticationService: AuthenticationService,
    protected organogramService: OrganogramService
  ) {
    super(service, dialog, snackbar);
  }

  ngOnInit(): void {
    this.dataSource = new MatTableDataSource<Settings>();
    this.initializeBuilding();
    this.getOfficeTree();
    this.inItOffices();
  }

  inItOffices() {
    if (this.data.dto.sharedRoomList.length !== 0) {
      this.data.dto.sharedRoomList.forEach(x => {
        const s = new Settings();
        if (x.hasAccess !== this.authenticationService.currentUserValue.officeOid) {
          s.oid = x.hasAccess;
          this.selectedOfficesOid.push(s.oid);
        }
      });
    }
  }

  initializeBuilding() {
    if (this.data.dto.building) {
      this.building = new Building();
      this.building.buildingName = this.data.dto.building.buildingName;
      this.building.oid = this.data.dto.buildingOid;
    }
  }

  isInitiallySelected(row) {
    if (this.selectedOfficesOid.includes(row.oid)) {
      this.selection.select(row);
      return this.selectedOfficesOid.includes(row.oid);
    }
  }

  getOfficeTree() {
    const dto = new Settings();
    dto.oid = this.authenticationService.currentUserValue.officeOid;
    this.organogramService.getOfficeOrganogram(dto).subscribe( response => {
      if (response.status !== 200) {
        return;
      }
      this.offices = response.data;
      this.dataSource.data = this.offices;
      this.isLoadingResults = false;
    });
  }

  setBuilding(building: Building) {
    if (building === null) {
      this.data.dto.buildingOid = undefined;
      return;
    }
    this.data.dto.buildingOid = building.oid;
  }

  masterToggle() {
    this.isAllSelected() ?
      this.makeAllUnSelected() :
      this.makeAllSelected();
  }

  isAllSelected() {
    return this.dataSource.data.length === this.selection.selected.length + 1;
  }

  makeAllUnSelected() {
    this.selection.clear();
    this.dataSource.data.forEach(row => this.selection.deselect(row));
    this.selectedOfficesOid = [];
  }

  makeAllSelected() {
    this.selectedOfficesOid = [];
    this.offices.forEach(x => {
      if (x.oid !== this.authenticationService.currentUserValue.officeOid) {
        this.selectedOfficesOid.push(x.oid);
        this.selection.select(x);
      }
    });
  }

  changeSelection(row) {
    if (this.selection.isSelected(row)) {
      this.selectedOfficesOid.forEach( x => {
        if (x === row.oid) {
          this.selectedOfficesOid.splice(this.selectedOfficesOid.indexOf(x), 1);
        }
      });
      this.selection.deselect(row);
    } else {
      this.selectedOfficesOid.push(row.oid);
      this.selection.select(row);
    }
  }

  isCheckedDisabled(office: Settings): boolean {
    return office.oid === this.authenticationService.currentUserValue.officeOid;
  }

  setSelfOffice() {
    const sharedRoom = new SharedRoom();
    if (this.data.dto.oid) {
      sharedRoom.roomOid = this.data.dto.oid;
    }
    sharedRoom.hasAccess = this.authenticationService.currentUserValue.officeOid;
    this.data.dto.sharedRoomList.push(sharedRoom);
  }

  setRestSelectedOffices() {
    this.selectedOfficesOid.forEach(x => {
      const sharedRoom = new SharedRoom();
      sharedRoom.hasAccess = x;
      this.data.dto.sharedRoomList.push(sharedRoom);
    });
  }

  updateStatus() {
    this.data.dto.sharedRoomList.forEach(x => {
      if (!this.selectedOfficesOid.includes(x.hasAccess) && (x.hasAccess !== this.authenticationService.currentUserValue.officeOid)) {
        x.status = END_POINT_DELETE;
      }
    });
  }

  shareWithNewlySelectedOffices() {
    const initialSharedRoomOidList: Array<string> = this.data.dto.sharedRoomList.map(x => x.hasAccess);
    this.selectedOfficesOid.forEach(x => {
      if (!initialSharedRoomOidList.includes(x)) {
        const sharedRoom = new SharedRoom();
        sharedRoom.hasAccess = x;
        this.data.dto.sharedRoomList.push(sharedRoom);
      }
    });
  }

  submit() {
    if (this.data.dto.buildingOid && this.data.dto.roomName && this.data.dto.roomCapacity ) {
      if (!this.data.dto.oid) { // during add
        this.data.dto.sharedRoomList = [];
        this.setSelfOffice();
        this.setRestSelectedOffices();
      } else {                  // during edit
        this.updateStatus();
        this.shareWithNewlySelectedOffices();
      }
      this.dialogRef.close(this.data.dto);
      return;
    }
    this.snackbar.open('দয়া করে আবশ্যক ফিল্ডগুলো পূরণ করুন')._dismissAfter(3000);
  }
}
