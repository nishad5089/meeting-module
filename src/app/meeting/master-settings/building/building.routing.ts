import {RouterModule, Routes} from '@angular/router';
import {NgModule} from '@angular/core';
import {BuildingListComponent} from './building-list/building-list.component';
import {BuildingComponent} from './building.component';
import {breadcrumb_path} from '../../../constant/messages';

const ROUTES: Routes = [
  {
    path: '',
    component: BuildingComponent,
    children: [
      {
        path: '',
        component: BuildingListComponent,
        data: {
          title: breadcrumb_path.LIST
        },
      },
    ],
    data: {
      title: breadcrumb_path.BUILDINGS
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(ROUTES)],
  exports: [RouterModule]
})
export class BuildingRouting {

}
