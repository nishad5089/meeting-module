import {Permission} from 'app/meeting/master-settings/acl/permission/model/permission';
import {Component, OnInit} from '@angular/core';
import {PermissionService} from 'app/meeting/master-settings/acl/permission/service/permission.service';
import {MatDialog, MatSnackBar, MatTableDataSource} from '@angular/material';
import {Roles} from 'app/meeting/master-settings/acl/roles/model/roles';
import {Action} from 'app/meeting/master-settings/acl/action/model/action';
import {RolesService} from 'app/meeting/master-settings/acl/roles/service/roles.service';
import {ActionService} from 'app/meeting/master-settings/acl/action/service/action.service';
import {BreadcrumbService} from 'app/shared/service/breadcrumb.service';
import {AuthenticationService} from 'app/shared/security/service/authentication.service';
import {MeetingStatusModalComponent} from './meeting-status.modal.component';
import {DialogModel} from '../../../../core/master-list.component';
import {success_message} from '../../../../../constant/messages';

@Component({
  templateUrl: './permission-list.component.html'
})

export class PermissionListComponent implements OnInit {
  permissionMap = new Map();
  displayColumns: string[];
  dataSource: MatTableDataSource<Action>;
  displayedRows: string[];
  roles: Array<Roles>;
  action: Array<Action>;
  meetingPermission: Array<Permission>;
  meetingOid: string [];
  loading = true;

  populatePermissionMap() {
    if (this.roles !== undefined) {
      this.roles.forEach(r => {
        if (r.roleBn !== ' ') {
          this.action.forEach(a => {
            let x = new Permission();
            x.isPermitted = 0;
            x.actionTag = a.actionTag;
            x.roleTag = r.roleTag;
            try {
              if (this.meetingPermission !== undefined) {
                this.meetingPermission.forEach(p => {
                  if (p !== undefined && p.roleTag === r.roleTag && p.actionTag === a.actionTag) {
                    x = p;
                  }
                });
              }
            } catch (err) {
            }
            this.permissionMap.set(r.roleTag + a.actionTag, x);
          });
        }
      });
      this.loading = false;
    }
  }


  constructor(
    protected permissionService: PermissionService,
    protected roleService: RolesService,
    protected actionSevice: ActionService,
    protected snackbar: MatSnackBar,
    protected dialog: MatDialog,
    protected breadcrumbService: BreadcrumbService,
    protected authenticationService: AuthenticationService
  ) {
    this.breadcrumbService.setBreadcrumb({
      'breadcrumbItemRoot': {label: 'ড্যাশবোর্ড', url: '/meetings'},
      'breadcrumbItem1': 'acl',
      'breadcrumbItem2': 'permission'
    });
    this.displayColumns = [];
    this.dataSource = new MatTableDataSource<Action>();

  }


  ngOnInit() {

    const roleModel = new Roles();

    this.roleService.search(roleModel, 10000).subscribe(result => {

      if (result.status !== 200) {
      }
      const dummyRole = new Roles();
      dummyRole.roleBn = ' ';
      this.roles = [];
      this.roles.push(dummyRole);
      this.roles = [...this.roles, ...result.data.content];

      this.displayColumns = [];
      this.displayColumns = [...this.displayColumns, ...this.roles.map(c => String(c.roleBn))];

      this.getPermissions();

    });

  }

  getPermissions() {
    const permission = new Permission();
    this.loading = true;
    this.permissionService.search(permission, 10000).subscribe(re => {

      this.actionSevice.search(new Action(), 10000).subscribe(res => {
        this.action = res.data.content;
        this.populatePermissionMap();
        this.displayedRows = this.action.map(x => x.actionBn);
        this.dataSource = new MatTableDataSource<Action>(this.action);
      });
      this.meetingPermission = re.data.content;
    }, null
    , () => {
      this.loading = false;
      });
  }

  checkPermission(column: Roles, element: Action) {
    return this.permissionMap.get(column.roleTag + element.actionTag) !== undefined
      && this.permissionMap.get(column.roleTag + element.actionTag).isPermitted === 1;
  }

  setStatusPermission(r: Roles, a: Action, perm: Permission) {
    const dialogModel = new DialogModel<Permission>();
    dialogModel.dialogTitle = ' মিটিংয়ের অনুমোদিত​ অবস্থাসমূহ​';
    dialogModel.dto = perm;
    this.dialog.open(MeetingStatusModalComponent, {
      width: '35%',
      data: dialogModel
    }).afterClosed().subscribe(res => {
      if (res) {
        perm.combinedMeetingStatus = res;
        this.permissionMap.set(r.roleTag + a.actionTag, perm);
      }
    });
  }

  onChange(r: Roles, a: Action, perm: Permission) {
    if (perm === undefined) {
      perm = this.permissionMap.get(r.roleTag + a.actionTag);
    }
    if (perm === undefined) {
      perm = new Permission();
      perm.actionTag = a.actionTag;
      perm.roleTag = r.roleTag;
      perm.isPermitted = 0;
    }
    perm.isPermitted = perm.isPermitted === 0 ? 1 : 0;
    this.permissionMap.set(r.roleTag + a.actionTag, perm);
  }

  save() {
    this.loading = true;
    this.permissionService.createAll(Array.from(this.permissionMap.values())).subscribe(response => {
      if (response.status !== 200) {
        this.snackbar.open(response.errors)._dismissAfter(3000);

      } else {
        this.snackbar.open(success_message.SAVED_SUCCESSFULLY)._dismissAfter(3000);
        return;
      }
    }, error => {

    }, () => {
      this.getPermissions();
      this.loading = false;
    });
  }

}
