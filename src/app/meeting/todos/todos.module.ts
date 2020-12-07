import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {TodosRoutingModule} from './todos-routing.module';
import {TodosComponent} from './todos.component';
import {MatCardModule, MatInputModule, MatTableModule, MatTabsModule} from '@angular/material';
import {NoticeApprovalComponent} from './component/notice-approval/notice-approval.component';
import {ResolutionApprovalComponent} from './component/resolution-approval/resolution-approval.component';
import {ResponseComponent} from './component/response/response.component';
import {WorkingPaperComponent, WorkingPaperUploadDialogComponent} from './component/working-paper/working-paper.component';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {NgxExtendedPdfViewerModule} from 'ngx-extended-pdf-viewer';
import {NominationComponent} from './component/response/nomination/nomination.component';
import {NoticeConfirmationDialogComponent} from './component/notice-approval/confirmation-dialog/notice-confirmation-dialog.component';
// tslint:disable-next-line:max-line-length
import {ResolutionConfirmationDialogComponent} from './component/resolution-approval/confirmation-dialog/resolution-confirmation-dialog.component';
import {RoomConflictComponent} from './component/room-confilct/room-conflict.component';
import {DemoMaterialModule} from '../../material.module';
import {PdfViewerModalComponent} from '../../shared/pdf-viewer/pdf-viewer.modal';
import {SharedModule} from '../../shared/shared.module';
import {ConfirmationComponent} from '../../shared/confirmation/confirmation.component';


@NgModule({
  declarations: [
    TodosComponent,
    NoticeApprovalComponent,
    ResolutionApprovalComponent,
    ResponseComponent,
    WorkingPaperComponent,
    WorkingPaperUploadDialogComponent,
    NominationComponent,
    NoticeConfirmationDialogComponent,
    ResolutionConfirmationDialogComponent,
    RoomConflictComponent
  ],
  imports: [
    CommonModule,
    TodosRoutingModule,
    MatInputModule,
    MatTableModule,
    MatTabsModule,
    MatCardModule,
    DemoMaterialModule,
    FormsModule,
    NgxExtendedPdfViewerModule,
    ReactiveFormsModule,
    SharedModule
  ],
  entryComponents: [
    WorkingPaperUploadDialogComponent,
    NominationComponent,
    NoticeConfirmationDialogComponent,
    ResolutionConfirmationDialogComponent,
    PdfViewerModalComponent,
    ConfirmationComponent
  ],
  exports: [
    TodosComponent
  ]
})
export class TodosModule {
}
