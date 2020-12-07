import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {TodosComponent} from './todos.component';
import {breadcrumb_path} from '../../constant/messages';

const routes: Routes = [
  {
    path: '',
    component: TodosComponent,
    data: {
      title: breadcrumb_path.TODOS
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TodosRoutingModule {
}
