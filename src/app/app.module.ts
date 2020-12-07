import {BrowserModule, HAMMER_LOADER} from '@angular/platform-browser';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {LOCALE_ID, NgModule} from '@angular/core';
import {LocationStrategy, PathLocationStrategy, registerLocaleData} from '@angular/common';

import {PerfectScrollbarConfigInterface, PerfectScrollbarModule} from 'ngx-perfect-scrollbar';
import {AppComponent} from './app.component';
// Import containers
import {DefaultLayoutComponent} from './containers';
import {AppAsideModule, AppBreadcrumbModule, AppFooterModule, AppHeaderModule, AppSidebarModule} from '@coreui/angular';
// Import routing module
import {AppRoutingModule} from './app.routing';
// Import 3rd party components
import {BsDropdownModule} from 'ngx-bootstrap/dropdown';
import {TabsModule} from 'ngx-bootstrap/tabs';
import {HTTP_INTERCEPTORS, HttpClientModule} from '@angular/common/http';
import {DemoMaterialModule} from './material.module';
import {SharedModule} from './shared/shared.module';
import localeBn from '@angular/common/locales/bn';
import localeBnExtra from '@angular/common/locales/extra/bn';
import {getBnPaginatorIntl} from './bn-paginator-intl';
import {MAT_DATE_LOCALE, MatPaginatorIntl} from '@angular/material';
import {JwtInterceptor} from './shared/service/JwtInterceptor';
import {ErrorInterceptor} from './shared/service/error-interceptor';


const DEFAULT_PERFECT_SCROLLBAR_CONFIG: PerfectScrollbarConfigInterface = {
  suppressScrollX: true
};

const APP_CONTAINERS = [
  DefaultLayoutComponent
];

registerLocaleData(localeBn, 'bn-BD', localeBnExtra);


@NgModule({
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    AppAsideModule,
    AppBreadcrumbModule.forRoot(),
    AppFooterModule,
    AppHeaderModule,
    AppSidebarModule,
    PerfectScrollbarModule,
    HttpClientModule,
    DemoMaterialModule,
    BsDropdownModule.forRoot(),
    SharedModule,
    TabsModule.forRoot(),
    // ChartsModule
  ],
  declarations: [
    AppComponent,
    ...APP_CONTAINERS
  ],
  providers: [
    {provide: LocationStrategy, useClass: PathLocationStrategy},
    {provide: MAT_DATE_LOCALE, useValue: 'bn-BD'},
    {provide: LOCALE_ID, useValue: 'bn-BD'},
    {provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true},
    {provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true},
    {provide: MatPaginatorIntl, useValue: getBnPaginatorIntl()},
    {
      provide: HAMMER_LOADER,
      useValue: () => new Promise(() => {
      })
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
