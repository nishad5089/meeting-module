import {Component, Inject} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';
import {DialogModel} from 'app/meeting/core/master-list.component';
import {Group} from 'app/meeting/groups/model/group';
import {MatSnackBar} from '@angular/material/snack-bar';
import {warn_message} from '../../../../constant/messages';
import {environment} from '../../../../../environments/environment';

@Component({
  templateUrl: './group-modal.component.html',
})
export class GroupModalComponent {

  constructor(
    public dialogRef: MatDialogRef<GroupModalComponent>,
    protected snackbar: MatSnackBar,
    @Inject(MAT_DIALOG_DATA) public data: DialogModel<Group>) {
    environment.IS_MODAL_OPEN = true;
  }

  validateAndSave() {
    if (this.data.dto.groupName === undefined
        || this.data.dto.groupName.trim().length === 0) {
      this.snackbar.open(warn_message.ENTER_GROUP_NAME)._dismissAfter(3000);
      return;
    }
    environment.IS_MODAL_OPEN = false;
    this.dialogRef.close(this.data.dto);
  }

  closeModal() {
    environment.IS_MODAL_OPEN = false;
    this.dialogRef.close();
  }

}
