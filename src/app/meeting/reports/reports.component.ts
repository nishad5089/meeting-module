import {Component} from '@angular/core';
import {MasterComponent} from '../core/master.component';
import {MeetingDetailsService} from '../service/meeting-details.service';
import {MatDialog, MatSnackBar} from '@angular/material';
import {MeetingDetails} from '../model/meeting-details';
import {MeetingInvitee} from '../model/meeting-invitee';
import {Observable} from 'rxjs';
import {FormControl} from '@angular/forms';
import {MemberAutocompleteService} from '../../shared/service/member-autocomplete.service';
import {AuthenticationService} from '../../shared/security/service/authentication.service';
import {warn_message} from '../../constant/messages';

@Component({
  templateUrl: 'reports.component.html'
})

export class ReportsComponent extends MasterComponent<MeetingDetails> {
  isLoadingResults = false;
  employee: FormControl;

  constructor(protected service: MeetingDetailsService,
              protected dialog: MatDialog,
              protected snackbar: MatSnackBar,
              protected authenticationService: AuthenticationService) {
    super(service, dialog, snackbar);
    this.setDetails();
  }

  setDetails() {
    this.dto = new MeetingDetails();
    this.dto.invitees = new Array<MeetingInvitee>();
    this.dto.invitees.push(new MeetingInvitee());
  }

  downloadReport() {
    if (this.dto.taxStartDate === undefined || this.dto.taxEndDate === undefined) {
      this.snackbar.open(warn_message.SELECT_DATE)._dismissAfter(3000);
      return;
    } else if (this.dto.taxStartDate > this.dto.taxEndDate) {
      this.snackbar.open('তারিখের ব্যাপ্তি সঠিক নয়, দয়া করে সংশোধন করুন')._dismissAfter(4000);
      return;
    }
    this.isLoadingResults = true;
    this.dto.invitees[0].memberOid = this.authenticationService.currentUserValue.employeeOfficeId;
    this.service.generateTaxReport(this.dto).subscribe(content => {
      const file = new File([content], 'tax_report.pdf');
      if (window.navigator && window.navigator.msSaveOrOpenBlob) {
        window.navigator.msSaveOrOpenBlob(file);
        return;
      }
      // For other browsers:
      // Create a link pointing to the ObjectURL containing the blob.
      const dataFile = window.URL.createObjectURL(file);

      const link = document.createElement('a');
      link.href = dataFile;
      link.download = file.name;
      // this is necessary as link.click() does not work on the latest firefox
      link.dispatchEvent(new MouseEvent('click', {bubbles: true, cancelable: true, view: window}));

      setTimeout(function () {
        // For Firefox it is necessary to delay revoking the ObjectURL
        window.URL.revokeObjectURL(dataFile);
        link.remove();
      }, 300);
    },
      error1 => {},
      () => {
        this.isLoadingResults = false;
      });
  }
}
