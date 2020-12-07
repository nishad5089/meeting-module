import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {DefaultLayoutComponent} from './containers';
import {AuthGuardService} from './shared/security/service/auth-guard.service';
import {breadcrumb_path} from './constant/messages';
import {P404Component} from './shared/error/404.component';
import {UnauthorizedComponent} from './shared/error/unauthorized.component';

export const routes: Routes = [
  {
    path: '',
    component: DefaultLayoutComponent,
    data: {
      title: breadcrumb_path.DASHBOARD
    },
    children: [
      {
        path: 'meetings',
        loadChildren: 'app/meeting/meeting.module#MeetingModule',
      },
      {
        path: '',
        redirectTo: 'meetings',
        pathMatch: 'full'
      }
    ],
   // canActivate: [AuthGuardService]
  },
  {
    path: 'not-found',
    component: P404Component,
    data: {
      title: 'Page 404'
    }
  },
  {
    path: 'unauthorized',
    component: UnauthorizedComponent,
    data: {
      title: 'Page 403'
    }
  },
  {
    path: '**',
    redirectTo: 'not-found',
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes)
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
