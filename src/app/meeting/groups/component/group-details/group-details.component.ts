import {Component} from '@angular/core';
import {GroupService} from 'app/meeting/groups/service/group.service';
import {GroupMember} from 'app/meeting/groups/model/group-member';
import {MatDialog, MatSnackBar} from '@angular/material';
import {ActivatedRoute, Router} from '@angular/router';
import {GroupMembersService} from 'app/meeting/groups/service/group-members.service';
import {MemberManagementComponent} from 'app/shared/member-management/member-management.component';
import {MasterListComponent} from 'app/meeting/core/master-list.component';
import {Group} from 'app/meeting/groups/model/group';
import {MatTableDataSource} from '@angular/material/table';
import {ACTION_ADD_GROUP_MEMBER, ACTION_DELETE_GROUP_MEMBER} from '../../../../constant/action-tags';
import {info_message, success_message} from '../../../../constant/messages';
import {attendee_type} from '../../../../constant/attendee-type';

@Component({
  templateUrl: './group-details.component.html',
})

export class GroupDetailsComponent extends MasterListComponent<GroupMember> {

  static group = new Group();

  actionTagAddGroupMember = ACTION_ADD_GROUP_MEMBER;
  actionTagDeleteGroupMember = ACTION_DELETE_GROUP_MEMBER;

  empOids: Array<string> = [];
  guestOids: Array<string> = [];
  groupMembers: Array<GroupMember> = [];

  constructor(protected groupService: GroupService,
              protected router: Router,
              protected dialog: MatDialog,
              protected snackbar: MatSnackBar,
              protected service: GroupMembersService,
              protected route: ActivatedRoute) {
    super(service, dialog, snackbar);
    this.dto = new GroupMember();
    this.getGroup();
    this.settingsName = 'গ্রুপের সদস্য';
  }

  getGroup() {
    if (GroupDetailsComponent.group.oid === undefined) {
      const y = new Group();
      y.oid = this.route.snapshot.paramMap.get('oid');
      this.groupService.getOne(y).subscribe(x => {
        GroupDetailsComponent.group = x.data;
        this.dto.groupOid = GroupDetailsComponent.group.oid;
        this.search();
      });
    } else {
      this.dto.groupOid = GroupDetailsComponent.group.oid;
      this.search();
    }
  }

  setAddModal() {
  }

  setEditModal() {
  }

  setFilter() {
  }

  setTableDetails() {
    this.displayColumns = ['sl', 'name', 'designation', 'department', 'organization', 'email', 'mobileNo', 'actions'];
    this.addButtonTooltips = info_message.ADD_GROUP_MEMBER;
  }

  search() {
    this.dataSource = new MatTableDataSource<GroupMember>();
    this.dataSource.sort = this.sort;
    this.service.getMemberListWithEmployee(this.dto).subscribe(response => {
      this.isLoadingResults = false;
      this.groupMembers = response.data;
      this.dataSource.data = this.groupMembers;
      this.dataSource.sort = this.sort;
      this.dataSource.paginator = this.paginator;
    });
  }

  getEmployeesAndGuestsOid() {
    this.empOids = [];
    this.guestOids = [];
    for (let i = 0; i < this.groupMembers.length; i++) {
      if (this.groupMembers[i].memberType === attendee_type.EMPLOYEE) {
        this.empOids.push(this.groupMembers[i].memberOid);
      } else if (this.groupMembers[i].memberType === attendee_type.GUEST) {
        this.guestOids.push(this.groupMembers[i].memberOid);
      }
    }
  }

  openAddGroupMembersDialog() {
    this.getEmployeesAndGuestsOid();
    const dialogRef = this.dialog.open(MemberManagementComponent, {
      width: '90%',
      data: {
        memberType: '',
        employeesOid: this.empOids,
        guestsOid: this.guestOids,
        groupsOid: [],
        type: 'member'
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result === undefined || result === null || result === '') {
      } else {
        this.getGroupMembers(result);
      }
    });
  }

  getGroupMembers(result) {
    let membersToCreate: Array<GroupMember> = [];
    if (result.memberType === 'groups') {
      // ToDo change to get list directly
      const group: Group = new Group();
      group.groupOidListForMemberAdd = result.groupsOid;
      this.groupService.getSelectedGroupMembers(group).subscribe(res => {
        membersToCreate = res.data;
        for (let i = 0; i < membersToCreate.length; i++) {
          membersToCreate[i].groupOid = GroupDetailsComponent.group.oid;
        }
        this.saveMembers(membersToCreate);
      });
    } else {
      this.saveMembers(this.groupMembersFactory(result.memberType,
        result.memberType === attendee_type.GUEST ? result.guestsOid : result.employeesOid));
    }
  }

  saveMembers(membersToCreate: Array<GroupMember>) {
    this.service.createAll(membersToCreate).subscribe(response => {
      if (response.status !== 200) {
        this.snackbar.open(response.errors)._dismissAfter(3000);
        return;
      }
      this.snackbar.open(success_message.ADDED_SUCCESSFULLY)._dismissAfter(3000);
      this.search();
    });
  }

  groupMembersFactory(memberType: string, membersOid: Array<string>): Array<GroupMember> {
    this.log(memberType);
    const membersToCreate: Array<GroupMember> = new Array<GroupMember>();
    for (let i = 0; i < membersOid.length; i++) {
      const groupMember: GroupMember = new GroupMember();
      groupMember.groupOid = GroupDetailsComponent.group.oid;
      groupMember.memberType = memberType;
      groupMember.memberOid = membersOid[i];
      membersToCreate.push(groupMember);
      this.log(groupMember);
    }
    return membersToCreate;
  }

  getGroupDetails(type: string): string {
    return GroupDetailsComponent.group[type];
  }

}
