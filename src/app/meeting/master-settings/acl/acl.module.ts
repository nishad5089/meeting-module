import {NgModule} from '@angular/core';
import {AclRoutingModule} from './acl-routing.module';
import {CommonModule} from '@angular/common';
import {AclComponent} from './acl.component';

@NgModule({

  declarations: [
    AclComponent
  ],
  imports: [
    AclRoutingModule,
    CommonModule,

  ]
})

export class AclModule {


}
