import {NgModule} from '@angular/core';
import {GuestsRoutingModule} from 'app/meeting/guests/guests-routing.module';
import {GuestsListComponent} from 'app/meeting/guests/components/guests-list/guests-list.component';
import {CommonModule} from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {DemoMaterialModule} from '../../material.module';
import {SharedModule} from 'app/shared/shared.module';
import {AddGuestComponent} from 'app/shared/add-guest/add-guest.component';
import {GuestsComponent} from './guests.component';
import {ConfirmationComponent} from '../../shared/confirmation/confirmation.component';

@NgModule({
  declarations: [
    GuestsComponent,
    GuestsListComponent
  ],
  imports: [
    GuestsRoutingModule,
    CommonModule,
    FormsModule,
    DemoMaterialModule,
    ReactiveFormsModule,
    SharedModule
  ],
  entryComponents: [
    AddGuestComponent,
    ConfirmationComponent
  ],
  exports: [
  ]
})
export class GuestsModule {
}
