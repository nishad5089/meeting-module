import {DELETE_MSG, MasterComponent} from './master.component';
import {MasterModel} from '../..//meeting/core/master.model';
import {MasterService} from '../../meeting/core/master.service';
import {OnInit, ViewChild} from '@angular/core';
import {merge, of as observableOf} from 'rxjs';
import {catchError, map, startWith, switchMap} from 'rxjs/operators';
import {MatDialog, MatPaginator, MatSnackBar, MatSort, MatTableDataSource} from '@angular/material';
import {ConfirmationComponent} from '../../shared/confirmation/confirmation.component';
import {HTTP_STATUS_OK} from '../../meeting/service/meeting.service';
import {success_message, warn_message} from '../../constant/messages';

export abstract class MasterListComponent<T extends MasterModel> extends MasterComponent<T> implements OnInit {

  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
  @ViewChild(MatSort, {static: true}) sort: MatSort;

  public pageSizeOptions = [50, 100, 200];
  public addButtonTooltips = 'Add';
  public size = 100;
  public sorting = 'createdOn,desc';

  public dataSource: MatTableDataSource<T>;
  public displayColumns: string[];
  public dto: T;

  public isLoadingResults = true;
  public showFilters = false;

  public dialogAddComponent: any;
  public dialogAddModel: DialogModel<T>;
  public dialogEditComponent: any;
  public dialogEditModel: DialogModel<T>;

  permissionMap: Map<string, boolean> = new Map<string, boolean>();


  constructor (protected service: MasterService<T>,
              protected dialog: MatDialog,
              protected snackbar: MatSnackBar) {
    super(service, dialog, snackbar);
    this.setTableDetails();
    this.setAddModal();
    this.setEditModal();
    // this.setFilter();

    const permissions = JSON.parse(localStorage.getItem('userAllPermissions'));
    this.permissionMap = permissions ? permissions['user_permissions'] : new Map();
  }

  abstract setTableDetails();

  abstract setFilter();

  abstract setAddModal();

  abstract setEditModal();

  delete(dto: T) {
    this.message = warn_message.DELETE_ELEMENT_PART_1 + '<strong>নির্দিষ্ট​ ' + this.settingsName + '</strong>' + warn_message.DELETE_ELEMENT_PART_2;
    const dialogRef = this.dialog.open(ConfirmationComponent, {
      width: '40%',
      data: {value: this.settingsName, message: this.message}
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result !== undefined) {
        this.service.delete(dto).subscribe(response => {
          if (response.status === HTTP_STATUS_OK) {
            this.snackbar.open(success_message.DELETED_SUCCESSFULLY)._dismissAfter(3000);
            this.removeRowFromTable(dto);
          }
        });
      }
    }, error => this.errorHandler(error));
  }

  preSearch() {
    if (this.dataSource === undefined) {
      this.dataSource = new MatTableDataSource<T>();
      this.dataSource.sort = this.sort;
      this.paginator.pageSize = this.pageSizeOptions[0];
      this.dataSource.sortingDataAccessor = (item, property) => {
        return typeof item[property] === 'string' ? item[property].toLowerCase() : item[property];
      };
    }
    if (this.sort !== undefined) {
      this.sort.sortChange.subscribe(() => {
        this.sorting = this.sort.active + ',' + this.sort.start;
        this.paginator.pageIndex = 0;
      });
    }
  }

  search(dto: T) {
    this.preSearch();
    merge(this.sort.sortChange, this.paginator.page)
      .pipe(
        startWith({}),
        switchMap(() => {
          this.isLoadingResults = true;
          return this.service.search(dto, this.paginator.pageSize, this.paginator.pageIndex, this.sorting);
        }),
        map(data => {
          this.isLoadingResults = false;
          // this.isRateLimitReached = false;
          if (data === undefined || data.status !== 200) {
            this.snackbar.open(data.errors)._dismissAfter(3000);
            return;
          }
          // this.paginator.pageIndex = data.data.number;
          // // this.paginator.pageSize = data.data.size;
          this.paginator.length = data.data.totalElements;
          this.searchCallback();
          return data.data.content;
        }),
        catchError(() => {
          this.isLoadingResults = false;
          return observableOf([]);
        })
      ).subscribe(data => {
      this.dataSource.data = data;
    }, err => this.errorHandler(err));
  }

  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  ngOnInit() {
    this.search(this.dto);
  }

  removeRowFromTable(dto: T) {
    this.search(this.dto);
  }

  reset() {
    // ToDo can we change it?
    this.setTableDetails();
  }

  add(): void {
    this.dialog.open(this.dialogAddComponent, {
      width: '60%',
      data: this.dialogAddModel
    }).afterClosed().subscribe(result => {
      if (result !== undefined) {
        this.service.create(result).subscribe(response => {
          if (response.status !== 200) {
            this.snackbar.open(response.errors)._dismissAfter(3000);
            return;
          }
          this.snackbar.open(success_message.CREATED_SUCCESSFULLY)._dismissAfter(3000);
          this.search(this.dto);
        });
      }
    }, error => this.errorHandler(error));
  }


  update(dto: T) {
    try {
      this.dialogEditModel.dto = dto;
      this.dialog.open(this.dialogEditComponent, {
        width: '60%',
        data: this.dialogEditModel
      }).afterClosed().subscribe(result => {
        if (result !== undefined) {
          this.service.update(result).subscribe(response => {
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

  errorHandler(err) {
    this.isLoadingResults = false;
    this.snackbar.open(err)._dismissAfter(3000);
  }

  canAdd(actionTag: string): boolean {
    return this.permissionMap[actionTag];
  }

  canEdit(actionTag: string): boolean {
    return this.permissionMap[actionTag];
  }

  canDelete(actionTag: string): boolean {
    return this.permissionMap[actionTag];
  }

  public searchCallback() {

  }
}

export class DialogModel<T> {
  dialogTitle: string;
  dto: T;

}
