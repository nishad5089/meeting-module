import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {CalendarComponent} from './calendar/calendar.component';
import {ListComponent} from './list/list.component';
import {DashboardRoutingModule} from './dashboard-routing.module';
import {
  MatCardModule,
  MatDatepickerModule,
  MatIconModule,
  MatInputModule,
  MatOptionModule,
  MatPaginatorModule,
  MatProgressSpinnerModule,
  MatSelectModule,
  MatSortModule,
  MatTableModule,
  MatTooltipModule
} from '@angular/material';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {DemoMaterialModule} from '../../material.module';
import {CalendarCommonModule, CalendarModule, DateAdapter} from 'angular-calendar';
import {adapterFactory} from 'angular-calendar/date-adapters/date-fns';
import {DashboardTodosComponent} from './calendar/dashboard-todos/dashboard-todos.component';
import {CalendarDialogComponent} from './calendar/calendar-dialog.component';
import {SharedModule} from '../../shared/shared.module';


@NgModule({
  declarations: [
    CalendarComponent,
    ListComponent,
    CalendarDialogComponent,
    DashboardTodosComponent
  ],
  entryComponents: [
    CalendarDialogComponent
  ],
  imports: [
    DashboardRoutingModule,
    CommonModule,
    MatPaginatorModule,
    CalendarModule.forRoot({
      provide: DateAdapter,
      useFactory: adapterFactory
    }),
    FormsModule,
    MatCardModule,
    MatIconModule,
    MatTableModule,
    MatProgressSpinnerModule,
    MatSortModule,
    MatDatepickerModule,
    MatOptionModule,
    MatSelectModule,
    MatInputModule,
    MatTooltipModule,
    DemoMaterialModule,
    ReactiveFormsModule,
    CalendarCommonModule,
    CalendarModule,
    SharedModule
  ]
})
export class DashboardModule { }
