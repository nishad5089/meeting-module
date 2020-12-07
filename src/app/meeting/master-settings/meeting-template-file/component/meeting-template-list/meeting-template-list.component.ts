import {Component, OnInit} from '@angular/core';
import {MatDialog, MatSnackBar} from '@angular/material';
import {MeetingTemplate} from '../../model/meeting-template';
import {MeetingTemplateService} from '../../service/meeting-template.service';
import {CreateTemplateComponent} from '../create-template/create-template.component';
import {DialogModel, MasterListComponent} from '../../../../core/master-list.component';
import {CmnFileService} from '../../../../service/cmn-file.service';

@Component({
  selector: 'app-meeting-template',
  templateUrl: './meeting-template-list.component.html',
  styleUrls: ['./meeting-template-list.component.css']
})

export class MeetingTemplateListComponent extends MasterListComponent<MeetingTemplate> implements OnInit {

  templateOptions = [{value: 'notice', label: 'নোটিশ​'},
    {value: 'resolution', label: 'কার্যবিবরণী'},
    {value: 'others', label: 'অন্যান্য​'}];

  constructor(public dialog: MatDialog,
              protected service: MeetingTemplateService,
              protected cmnFileService: CmnFileService,
              protected snackbar: MatSnackBar) {
    super(service, dialog, snackbar);
  }

  ngOnInit() {
    this.settingsName = 'টেম্পলেট';
    this.search(this.dto);
  }

  download(element: MeetingTemplate) {
    this.cmnFileService.downloadFile({oid: element.fileOid}).subscribe(data => {
      // element.templateTitle.endsWith('.docx') ?
      const fileName: string = element.templateTitle.endsWith('.docx') ? element.templateTitle : element.templateTitle + '.docx';
      const newFile = new File([data], fileName);
      if (window.navigator && window.navigator.msSaveOrOpenBlob) {
        window.navigator.msSaveOrOpenBlob(newFile);
        return;
      }
      // For other browsers:
      // Create a link pointing to the ObjectURL containing the blob.
      const content = window.URL.createObjectURL(newFile);

      const link = document.createElement('a');
      link.href = content;
      link.download = newFile.name;
      // this is necessary as link.click() does not work on the latest firefox
      link.dispatchEvent(new MouseEvent('click', {bubbles: true, cancelable: true, view: window}));

      setTimeout(function () {
        // For Firefox it is necessary to delay revoking the ObjectURL
        window.URL.revokeObjectURL(content);
        link.remove();
      }, 100);
    });
  }

  setAddModal() {
    this.dialogAddComponent = CreateTemplateComponent;
    this.dialogAddModel = new DialogModel<MeetingTemplate>();
    this.dialogAddModel.dialogTitle = 'টেমপ্লেট যোগ করুন​';
    this.dialogAddModel.dto = new MeetingTemplate();
  }

  setEditModal() {
    this.dialogEditComponent = CreateTemplateComponent;
    this.dialogEditModel = new DialogModel<MeetingTemplate>();
    this.dialogEditModel.dialogTitle = 'টেমপ্লেট সম্পাদনকরণ​';
  }

  setFilter() {
  }

  setTableDetails() {
    this.displayColumns = ['sl', 'templateType', 'templateName', 'actions'];
    this.addButtonTooltips = 'মিটিংয়ের টেমপ্লেট যোগ করুন​';
    this.dto = new MeetingTemplate();
  }

  add(): void {
    this.dialog.open(this.dialogAddComponent, {
      width: '60%',
      data: this.dialogAddModel
    }).afterClosed().subscribe(result => {
      // do nothing
      this.search(this.dto);
    }, error => this.errorHandler(error));
  }

}
