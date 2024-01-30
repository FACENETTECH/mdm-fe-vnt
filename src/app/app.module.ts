import {
  APP_INITIALIZER,
  NgModule,
  CUSTOM_ELEMENTS_SCHEMA,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { BrowserModule, Title } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NZ_I18N, NzI18nService } from 'ng-zorro-antd/i18n';
import { en_US } from 'ng-zorro-antd/i18n';
import { vi_VN } from 'ng-zorro-antd/i18n';
import { registerLocaleData } from '@angular/common';
import en from '@angular/common/locales/en';
import vi from '@angular/common/locales/vi';
import { FormsModule } from '@angular/forms';
import {
  HttpClientModule,
  HttpClient,
  HTTP_INTERCEPTORS,
} from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { IconsProviderModule } from './icons-provider.module';
import { NzLayoutModule } from 'ng-zorro-antd/layout';
import { NzMenuModule } from 'ng-zorro-antd/menu';
import { NzI18nModule } from 'ng-zorro-antd/i18n';

//
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { MenuComponent } from './setting/menu/menu.component';
// import { NgxSpinnerModule } from "ngx-spinner";
export function createTranslateLoader(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}
registerLocaleData(en);
//
import {
  NgxUiLoaderModule,
  NgxUiLoaderConfig,
  SPINNER,
  PB_DIRECTION,
} from 'ngx-ui-loader';
import { ToastrModule } from 'ngx-toastr';
import { NzAvatarModule } from 'ng-zorro-antd/avatar';
import { NzDropDownModule } from 'ng-zorro-antd/dropdown';
import { NzPopconfirmModule } from 'ng-zorro-antd/popconfirm';
import { TourMatMenuModule } from 'ngx-ui-tour-md-menu';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { KeycloakService, KeycloakAngularModule } from 'keycloak-angular';
import { initializer } from './app-init';
import { ExceptionModule } from './shared/exception/exception.module';
import { NzPopoverModule } from 'ng-zorro-antd/popover';
import { SharedModule } from './shared/components/components.module';
import { TokenInterceptor } from './services/interceptors/token-interceptor';
import jwtDecode from 'jwt-decode';
import { LayoutComponent } from './shared/components/layout/layout.component';
import { HeaderComponent } from './shared/components/layout/header/header.component';
import { SiderComponent } from './shared/components/layout/sider/sider.component';
import { NzToolTipModule } from 'ng-zorro-antd/tooltip';
import { SiderMiniComponent } from './shared/components/layout/sider-mini/sider-mini.component';
import { HomeComponent } from './pages/home/home.component';

const ngxUiLoaderConfig: NgxUiLoaderConfig = {
  text: 'Loading...',
  textColor: '#FFFFFF',
  textPosition: 'center-center',
  pbColor: '#2C73EB',
  bgsColor: 'white',
  fgsColor: '#2C73EB',
  fgsType: SPINNER.rectangleBounce,
  fgsSize: 40,
  pbDirection: PB_DIRECTION.leftToRight,
  pbThickness: 3,
};

@NgModule({
  declarations: [
    AppComponent,
    MenuComponent,
    LayoutComponent,
    HeaderComponent,
    SiderComponent,
    SiderMiniComponent,
    HomeComponent,
  ],

  imports: [
    AppRoutingModule,
    ExceptionModule,
    TourMatMenuModule,
    CommonModule,
    NzToolTipModule,
    BrowserModule,
    FormsModule,
    NzI18nModule,
    HttpClientModule,
    BrowserAnimationsModule,
    ToastrModule.forRoot({
      positionClass: 'toast-top-right',
      preventDuplicates: true,
      countDuplicates: true,
    }),
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: createTranslateLoader,
        deps: [HttpClient],
      },
    }),
    IconsProviderModule,
    NzSelectModule,
    NzAvatarModule,
    NzDropDownModule,
    NzLayoutModule,
    NzMenuModule,
    NzPopconfirmModule,
    TourMatMenuModule,
    KeycloakAngularModule,
    NgxUiLoaderModule.forRoot(ngxUiLoaderConfig),
    NzPopoverModule,
    SharedModule,
  ],
  providers: [
    {
      provide: APP_INITIALIZER,
      useFactory: initializer,
      multi: true,
      deps: [KeycloakService],
    },
    // {
    //   provide: HTTP_INTERCEPTORS,
    //   useClass: TokenInterceptor,
    //   multi: true,
    // },
    Title,
    { provide: NZ_I18N, useValue: en_US },
  ],
  bootstrap: [AppComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class AppModule {}
