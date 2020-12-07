import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {SettingsListComponent} from './components/settings-list/settings-list.component';
import {SettingsRoutingModule} from 'app/meeting/guests/settings/settings-routing.module';
import {SettingsSaveComponent} from 'app/meeting/guests/settings/components/settings-save/settings-save.component';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {DemoMaterialModule} from 'app/material.module';
import {SharedModule} from '../../../shared/shared.module';
import {SettingsComponent} from './settings.component';


@NgModule({
  declarations: [
    SettingsComponent,
    SettingsListComponent,
    SettingsSaveComponent
  ],
  imports: [
    SettingsRoutingModule,
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    DemoMaterialModule,
    SharedModule
  ],
  entryComponents: [
    SettingsSaveComponent
  ]
})
export class SettingsModule {
}
