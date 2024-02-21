import {
  Component,
  NgModule,
  Input,
  Output,
  EventEmitter,
  OnInit,
  Inject,
} from '@angular/core';
import { Title } from '@angular/platform-browser';
import { KeycloakService } from 'keycloak-angular';

import { AppI18nService } from 'src/app/services/AppI18n.service';
import { NzI18nService, en_US, vi_VN } from 'ng-zorro-antd/i18n';

import { DOCUMENT, registerLocaleData } from '@angular/common';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { Select } from 'src/app/models/select/select.model';
import { InforAccountService } from 'src/app/services/infor-account/infor-account.service';
import vi from '@angular/common/locales/vi';
import en from '@angular/common/locales/en';
import { environment } from 'src/environment/environment';
// import { BusinessService } from 'src/app/services/business/business.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
})
export class HeaderComponent {
  isAdmin: boolean = false;
  isvisibleLogout: boolean = false;
  options: Select[] = [
    { label: 'en_US', value: 'en_US' },
    { label: 'vi_VN', value: 'vi_VN' },
  ];
  showSelect: boolean = true;
  srcImg: string = './assets/icons/viet.svg';
  selectLanguage: string = 'vi_VN';

  constructor(
    @Inject(DOCUMENT) private document: any,
    private router: Router,
    // private getInfoSevice: BusinessService
    private title: Title,
    private i18n: NzI18nService,
    private appI18nService: AppI18nService,
    private keycloak: KeycloakService,
    private inforAccountService: InforAccountService
  ) {}
  user: any;
  elem: any;
  fullScreen: boolean = false;
  notificationOpen: boolean = false;
  notificationList: {
    type: string;
    time: string;
    date: string;
    content: string;
  }[] = [];
  userName: string = this.keycloak.getUsername();
  name: string = '';

  ngOnInit() {
    this.getInfoBusiness();
    this.elem = document.documentElement;
    // this.getInfoSevice.getInfoBusiness().subscribe((data) => {
    //   this.user = data;
    // });
    this.changeLanguage(this.selectLanguage);
    this.getName();
    this.checkAdmin();
  }

  checkAdmin() {
    const roles = this.keycloak.getUserRoles();
    for (let i = 0; i < roles.length; i++) {
      if (roles[i] == 'admin_business') {
        this.isAdmin = true;
        break;
      }
    }
  }

  logoBusiness: string = '';
  nameBusiness: string = '';
  getInfoBusiness() {
    this.inforAccountService.getInfoBusiness().subscribe({
      next: (value) => {
        if (value.data) {
          this.logoBusiness = value.data.logo;
          this.nameBusiness = value.data.enterpriseName;
          window.localStorage.setItem('favicon', this.logoBusiness);
          var linkElement = document.createElement('link');
          linkElement.rel = 'icon';
          linkElement.type = 'image/x-icon';
          linkElement.href = this.logoBusiness;
          document.head.appendChild(linkElement);
        } else {
          console.error('Lỗi: Trả về 200 nhưng không có dữ liệu');
        }
      },
      error: (err) => {
        console.error('Lỗi không lấy được thông tin doanh nghiệp', err);
      },
    });
  }

  logOut() {
    this.keycloak.logout();
  }

  logoutConfirm() {
    this.isvisibleLogout = true;
  }

  async getName() {
    let res = await this.keycloak.loadUserProfile();
    this.name = res.firstName + ' ' + res.lastName;
  }

  showOption() {
    if (this.showSelect) {
      this.showSelect = false;
    } else {
      this.showSelect = true;
    }
  }

  changeLanguage(language: string): void {
    this.showSelect = false;
    localStorage.setItem('language', language);
    if (language == 'vi_VN') {
      this.i18n.setLocale(vi_VN);
      registerLocaleData(vi);
      this.title.setTitle('Master data management');
      this.srcImg = './assets/icons/flag_vi.svg';
    } else {
      this.i18n.setLocale(en_US);
      registerLocaleData(en);
      this.title.setTitle('Master data management');
      this.srcImg = './assets/icons/flag_en.svg';
    }
    this.appI18nService.setLanguage(language);
  }

  openNotification() {
    if (this.notificationOpen === false) {
      this.notificationOpen = true;
    } else {
      this.notificationOpen = false;
    }
  }

  backToHomePage() {
    // localStorage.setItem('beforeBaseUrl', '');
    // localStorage.setItem('checkFetchSider', '');
    window.location.href = environment.url_home_page;
  }

  openFullscreen() {
    if (this.elem.requestFullscreen) {
      this.elem.requestFullscreen();
    } else if (this.elem.mozRequestFullScreen) {
      /* Firefox */
      this.elem.mozRequestFullScreen();
    } else if (this.elem.webkitRequestFullscreen) {
      /* Chrome, Safari and Opera */
      this.elem.webkitRequestFullscreen();
    } else if (this.elem.msRequestFullscreen) {
      /* IE/Edge */
      this.elem.msRequestFullscreen();
    }
    this.fullScreen = true;
  }

  /* Close fullscreen */
  closeFullscreen() {
    if (this.document.exitFullscreen) {
      this.document.exitFullscreen();
    } else if (this.document.mozCancelFullScreen) {
      /* Firefox */
      this.document.mozCancelFullScreen();
    } else if (this.document.webkitExitFullscreen) {
      /* Chrome, Safari and Opera */
      this.document.webkitExitFullscreen();
    } else if (this.document.msExitFullscreen) {
      /* IE/Edge */
      this.document.msExitFullscreen();
    }
    this.fullScreen = false;
  }
}
