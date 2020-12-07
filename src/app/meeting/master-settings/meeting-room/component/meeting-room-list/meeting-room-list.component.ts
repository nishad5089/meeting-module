import {Component, OnInit} from '@angular/core';
import {DialogModel, MasterListComponent} from '../../../../core/master-list.component';
import {MeetingRoom} from '../../model/meeting-room';
import {MatDialog, MatSnackBar} from '@angular/material';
import {MeetingRoomService} from 'app/meeting/master-settings/meeting-room/service/meeting-room.service';
import {MeetingRoomSaveComponent} from '../meeting-room-save/meeting-room-save.component';
import {Building} from '../../../building/model/building';
import {BuildingService} from '../../../building/service/building.service';
import {AuthenticationService} from '../../../../../shared/security/service/authentication.service';
import {OrganogramService} from '../../../../../shared/service/organogram.service';
import {Settings} from '../../../../guests/settings/model/settings';
import {animate, state, style, transition, trigger} from '@angular/animations';

@Component({
  templateUrl: './meeting-room-list.component.html',
  styleUrls: [
    'meeting-room-list.component.css'
  ],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({height: '0px', minHeight: '0'})),
      state('expanded', style({height: '*'})),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)'))
    ])
  ]
})
export class MeetingRoomListComponent extends MasterListComponent<MeetingRoom> implements OnInit {
  buildings: Building[];
  offices: Array<Settings> = [];
  expandedElement: MeetingRoom | null;
  userOfficeOid: string = '';
  resetVal: boolean;

  constructor(protected service: MeetingRoomService,
              protected snackbar: MatSnackBar,
              protected dialog: MatDialog,
              protected buildingService: BuildingService,
              protected authenticationService: AuthenticationService,
              protected organogramService: OrganogramService
  ) {
    super(service, dialog, snackbar);
    this.dto = new MeetingRoom();
    this.setFilter();
    this.settingsName = 'মিটিংয়ের কক্ষ';
    this.userOfficeOid = this.authenticationService.currentUserValue.officeOid;
  }

  setTableDetails() {
    this.resetVal = true;
    this.dto = new MeetingRoom();
    this.displayColumns = ['sl', 'roomName', 'roomCapacity', 'building', 'action'];
    this.addButtonTooltips = 'মিটিংয়ের কক্ষ যোগ করুন';
  }

  setFilter() {
    this.buildingService.search(new Building()).subscribe(response => {
      this.buildings = response.data.content;
    });
  }

  setAddModal() {
    this.dialogAddComponent = MeetingRoomSaveComponent;
    this.dialogAddModel = new DialogModel<MeetingRoom>();
    this.dialogAddModel.dialogTitle = 'মিটিংয়ের কক্ষ যুক্তকরণ​';
    this.dialogAddModel.dto = new MeetingRoom();
  }

  setEditModal() {
    this.dialogEditComponent = MeetingRoomSaveComponent;
    this.dialogEditModel = new DialogModel<MeetingRoom>();
    this.dialogEditModel.dialogTitle = 'মিটিংয়ের কক্ষ সম্পাদনকরণ';
  }

  getBuildingName(oid: string): Building {
    if (this.buildings !== undefined) {
      const build = this.buildings.filter(building => building.oid === oid)[0];
      if (build !== undefined) {
        return build;
      }
    }
    return new Building();
  }

  ngOnInit() {
    super.ngOnInit();
    this.getOfficeTree();
  }

  search(dto: MeetingRoom) {
    this.resetVal = false;
    super.search(dto);
  }

  getOfficeTree() {
    this.isLoadingResults = true;
    const dto = new Settings();
    dto.oid = this.authenticationService.currentUserValue.officeOid;
    this.organogramService.getOfficeOrganogram(dto).subscribe( response => {
      if (response.status !== 200) {
        return;
      }
      this.offices = response.data;
      this.isLoadingResults = false;
    });
  }

  setBuilding(building: Building) {
    this.resetVal = false;
    if (!building) {
      this.dto.buildingOid = undefined;
      return;
    }
    this.dto.buildingOid = building.oid;
  }

  add(): void {
    this.dialogAddModel.dto = new MeetingRoom();
    super.add();
  }

  getSharedOffices(room: MeetingRoom): Array<string> {
    const array: Array<string> = [];
    room.sharedRoomList.forEach(x => {
      this.offices.forEach(y => {
        if (y.oid === x.hasAccess) {
          array.push(y.fieldNameBn);
        }
      });
    });
    return array;
  }
}
