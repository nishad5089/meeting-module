import {MasterModel} from './master.model';
import {MasterService} from './master.service';
import {MatDialog, MatSnackBar} from '@angular/material';
import {IS_LIVE} from '../../../environments/environment';

export const DELETE_MSG = 'Are you sure you want to <b>delete</b> this ';


export abstract class MasterComponent<T extends MasterModel> {

  public dto: T;
  protected settingsName: string;
  protected message: string;

  constructor(protected service: MasterService<T>,
              protected dialog: MatDialog,
              protected snackbar: MatSnackBar) {
  }



  log(msg: any): void {
    // @ts-ignore
    if (IS_LIVE === false) {
      console.log(msg);
    }
  }

  showSnackbar(msg: string) {
    this.snackbar.open(msg)._dismissAfter(3000);
  }
}
