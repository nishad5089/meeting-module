import {RouterModule, Routes} from '@angular/router';
import {NgModule} from '@angular/core';
import {ActionListComponent} from './action-list/action-list.component';
import {breadcrumb_path} from '../../../../constant/messages';

const ROUTES: Routes = [
  {
    path: 'get-list',
    component: ActionListComponent,
    data: {
      title: breadcrumb_path.ACTION_TAG
    }
  },
  {
    path: '',
    redirectTo: 'get-list',
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [RouterModule.forChild(ROUTES)],
  exports: [RouterModule]
})

export class ActionRoutingModule {

}
