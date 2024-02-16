import { Component, Inject } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { AppI18nService } from 'src/app/services/AppI18n.service';
import { NzI18nService, en_US, vi_VN } from 'ng-zorro-antd/i18n';
import { Select } from './models/select/select.model';
import { IStepOption, TourService } from 'ngx-ui-tour-md-menu';
import { CookieService } from 'ngx-cookie-service';
import { KeycloakService } from 'keycloak-angular';
import Swal from 'sweetalert2';
import { DOCUMENT, registerLocaleData } from '@angular/common';
import { BaseService } from './services/base.service';
import { environment } from 'src/environment/environment';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute, Route, Router } from '@angular/router';
import { ThemeService } from './services/theme.service';
import { InforAccountService } from './services/infor-account/infor-account.service';
import jwtDecode from 'jwt-decode';
import vi from '@angular/common/locales/vi';
import { ManageComponentService } from './services/manage-component/manage-component.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  siderList: any = [];

  ///manage-user/list-account

  constructor(
    private appI18nService: AppI18nService,
    private title: Title,
    public tourService: TourService,
    public baseService: BaseService,
    private i18n: NzI18nService,
    private cookie: CookieService,
    private keycloak: KeycloakService,
    private http: HttpClient,
    private actRoute: ActivatedRoute,
    private _router: Router,
    @Inject(DOCUMENT) private document: any,
    private themeService: ThemeService,
    private inforAccountService: InforAccountService,
    private manageComponentService: ManageComponentService
  ) {
    this.getNameByCookie();
  }

  isCollapsed: boolean = false;
  selectLanguage: string = 'vi_VN';
  srcImg: string = '';
  saveLanguage: string | null = '';
  showSelect: boolean = true;
  menuDashboardWelcome: string = 'menu.dashboard.welcome';

  isFullScreen: boolean = false;

  userName: string = this.keycloak.getUsername();

  name: string = '';
  userRole = this.keycloak.getUserRoles(true);
  roles: any[] = [];

  // Logo
  logoBusiness: string = '';
  nameBusiness: string = '';

  async ngOnInit() {
    this.getInfoBusiness();

    await this.keycloak.getToken().then((token) => {
      const decodedToken: any = jwtDecode(token);
      this.roles = decodedToken.realm_access.roles;
    });

    if (this._router.url == '/') {
      // if (this.roles.includes('admin_business')) {
      //   this._router.navigate([`/home`]);
      // } else {
      //   this._router.navigate([`/home`]);
      // }

      // this.saveLanguage = localStorage.getItem('language');
      // if (this.saveLanguage) {
      //   this.selectLanguage = this.saveLanguage;
      // }
      // this.changeLanguage(this.selectLanguage);
      // this.tourService.initialize(this.tourSteps, {
      //   route: 'welcome',
      // delayBeforeStepShow: 300,
      // delayAfterNavigation: 150,
      // enableBackdrop: true,
      // prevBtnTitle: 'Trước',
      // nextBtnTitle: 'Sau',
      // endBtnTitle: 'Đóng',
      // });
      this.tourService.end();
      this.getColumns();
      this.getName();
    }

    if (this.roles.includes('admin_fcim')) {
      this._router.navigate([`exception/403`]);
    }
  }

  getInfoBusiness() {
    this.inforAccountService.getInfoBusiness().subscribe({
      next: (value) => {
        if (value.data) {
          this.logoBusiness = value.data.logo;
          this.nameBusiness = value.data.enterpriseName;
          if (!value.data.theme) {
            this.themeService.setCurrentTheme('default');
          } else {
            this.themeService.setCurrentTheme(value.data.theme);
          }
        } else {
          this.themeService.setCurrentTheme('default');
        }
      },
      error: (err) => {
        console.error('Lỗi không lấy được thông tin doanh nghiệp', err);
      },
    });
  }

  isvisibleLogout: boolean = false;

  async getName() {
    let res = await this.keycloak.loadUserProfile();
    console.log(res);
    this.name = res.firstName + ' ' + res.lastName;
  }

  table: any = [
    {
      id: 1,
      name: 'stage',
    },
    {
      id: 2,
      name: 'vendor',
    },
    {
      id: 3,
      name: 'job',
    },
    {
      id: 4,
      name: 'error',
    },
    {
      id: 5,
      name: 'errorGroup',
    },
    {
      id: 6,
      name: 'machine',
    },
    {
      id: 7,
      name: 'line',
    },
    {
      id: 8,
      name: 'btp',
    },
    {
      id: 9,
      name: 'tp',
    },
    {
      id: 10,
      name: 'nvl',
    },
    {
      id: 11,
      name: 'employee',
    },
    {
      id: 12,
      name: 'group',
    },
    {
      id: 16,
      name: 'bom',
    },
    {
      id: 20,
      name: 'file-design',
    },
  ];

  async getColumns() {
    this.table.map(async (t: any) => {
      this.http
        .get(`${environment.api_end_point}/api/column-properties/${t.id}`)
        // .subscribe({
        //   next: (res: any) => {
        //     res.data.map((x: any) => {
        //       x.localCheck = true;
        //     });
        //     localStorage.setItem(t.name, JSON.stringify(res.data));
        //   },
        // });
    });
  }

  // Hàm xử lý chức năng ẩn hiện select box
  showOption() {
    if (this.showSelect) {
      this.showSelect = false;
    } else {
      this.showSelect = true;
    }
  }

  // Hàm xử lý chức năng thay đổi ngôn ngữ
  changeLanguage(language: string): void {
    this.showSelect = false;
    localStorage.setItem('language', language);
    if (language == 'vi_VN') {
      this.i18n.setLocale(vi_VN);
      this.title.setTitle('Master Data Management');
      this.srcImg = './assets/img/vie.png';
    } else {
      this.i18n.setLocale(en_US);
      this.title.setTitle('Master Data Management');
      this.srcImg = './assets/img/eng.png';
    }
    this.appI18nService.setLanguage(language);
  }

  options: Select[] = [
    { label: 'en_US', value: 'en_US' },
    { label: 'vi_VN', value: 'vi_VN' },
  ];

  logOut() {
    // this.keycloak.logout();
    window.location.href =
      'http://localhost:4200/#/auth/business-acc-setting/home-page';
  }

  logoutConfirm() {
    this.isvisibleLogout = true;
  }

  notify() {}

  fullScreen() {
    let elem = document.documentElement;

    if (!this.isFullScreen) {
      if (elem.requestFullscreen) {
        elem.requestFullscreen();
        this.isFullScreen = true;
      }
    } else {
      if (this.document.exitFullscreen) {
        this.document.exitFullscreen();
        this.isFullScreen = false;
      }
    }
  }

  // Các hàm gọi API và xử lý thông tin các chức năng con
  
  /**
   * Đây là hàm lấy ra danh sách chức năng con theo tên chức năng cha
   */
  getListFunctionByName(data: any) {
    let sider: any;
    this.manageComponentService.getInforTables(data).subscribe({
      next: (res) => {
        console.log(res);
        sider = res.data;
        // Nếu chức năng cha có chức năng con sẽ thêm các thông tin về router với baseUrl là tên của chức năng cha
        if(sider.children.length > 0) {
          localStorage.setItem('baseUrl', JSON.stringify(sider));
          for(let i = 0; i < sider.children.length; i++) {
            this.siderList.push({
              ...sider.children[i],
              open: false,
              path: '/mdm/' + sider.name + '/' + sider.children[i].name,
              requiredRoles: ['admin_business'],
              children: []
            })
          }
          this._router.navigate([`${this.siderList[0].path}`]);
        }
        // Nếu chức năng cha KHÔNG có chức năng con sẽ thêm các thông tin về router không có baseUrl là tên của chức năng cha 
        else {
          localStorage.setItem('baseUrl', JSON.stringify(sider));
          this.siderList.push({
            ...sider,
            open: false,
            path: '/mdm/' + sider.name,
            requiredRoles: ['admin_business'],
          })
        }
      }, error: (err) => {
        console.log(err);
      }
    })

  }

  /**
   * Hàm lấy tên phân hệ khi redirect từ trang homepage
   */
  getNameByCookie() { 
    console.log(window.location.href);
    console.log(localStorage.getItem('beforeBaseUrl'));
    if(localStorage.getItem('beforeBaseUrl') == null || localStorage.getItem('beforeBaseUrl') == '') {
      let arr = window.location.href.split('/');
      console.log(arr);
      console.log(arr[arr.length - 1]);
      if(arr[arr.length - 1] == '') {
        if(localStorage.getItem("tableNameMDM") != null && localStorage.getItem("tableNameMDM") != '') {
          this.getListFunctionByName(localStorage.getItem("tableNameMDM"));
        } else {
          console.log(window.location.href);
          let arr = window.location.href.split('/');
          console.log(arr[arr.length - 1]);
          localStorage.setItem("tableNameMDM", arr[arr.length - 1]);
          this.getListFunctionByName(arr[arr.length - 1]);
        }
      } else {
        localStorage.setItem("tableNameMDM", arr[arr.length - 1]);
        this.getListFunctionByName(arr[arr.length - 1]);
      }
      localStorage.setItem('beforeBaseUrl', arr[arr.length - 1])
    } else {
      this.getListFunctionByName(localStorage.getItem('beforeBaseUrl'));
    }
    // if(localStorage.getItem("tableNameMDM") != null && localStorage.getItem("tableNameMDM") != '') {
    //   this.getListFunctionByName(localStorage.getItem("tableNameMDM"));
    // } else {
    //   console.log(window.location.href);
    //   let arr = window.location.href.split('/');
    //   console.log(arr[arr.length - 1]);
    //   localStorage.setItem("tableNameMDM", arr[arr.length - 1]);
    //   this.getListFunctionByName(arr[arr.length - 1]);
    // }

    // const cookies = document.cookie.split(';');
    // let data;
    // for (const cookie of cookies) {
    //   const [name, value] = cookie.split('=');
    //   if (name.trim() === 'data') {
    //     data = JSON.parse(decodeURIComponent(value));
    //     break;
    //   }
    // }
    // console.log(data);
    // if(data != undefined && data != null && data != '') {
    //   this.getListFunctionByName(data);
    // }
  }
}

// const dummySider = [
//   {
//     label: 'sider.configurationManagement',
//     icon: './assets/icons/sider/mdm.svg',
//     open: false,
//     path: '/manage-machine-line/manage-machine',
//     requiredRoles: [
//       'admin_business',
//       'mdm_config-manage',
//       'mdm_config-machine',
//       'mdm_config-stage',
//       'mdm_config-error',
//       'mdm_config-provider',
//       'mdm_config-employee',
//       'mdm_config-metarial',
//       'mdm_config-product',
//     ],
//     children: [
//       {
//         label: 'sider.configureMachine',
//         open: false,
//         path: '/manage-config/6',
//         requiredRoles: [
//           'admin_business',
//           'mdm_config-manage',
//           'mdm_config-machine',
//         ],
//       },
//       {
//         label: 'sider.configureStage',
//         open: false,
//         path: '/manage-config/1',
//         requiredRoles: [
//           'admin_business',
//           'mdm_config-manage',
//           'mdm_config-stage',
//         ],
//       },
//       {
//         label: 'sider.configureError',
//         open: false,
//         path: '/manage-config/4',
//         requiredRoles: [
//           'admin_business',
//           'mdm_config-manage',
//           'mdm_config-error',
//         ],
//       },
//       {
//         label: 'sider.configureFileDesign',
//         open: false,
//         path: '/manage-config/103',
//         requiredRoles: [
//           'admin_business',
//           'mdm_config-manage',
//           'mdm_config-file-design',
//         ],
//       },
//       {
//         label: 'sider.configureSupplier',
//         open: false,
//         path: '/manage-config/2',
//         requiredRoles: [
//           'admin_business',
//           'mdm_config-manage',
//           'mdm_config-provider',
//         ],
//       },
//       {
//         label: 'sider.configureEmployee',
//         open: false,
//         path: '/manage-config/11',
//         requiredRoles: [
//           'admin_business',
//           'mdm_config-manage',
//           'mdm_config-employee',
//         ],
//       },
//       {
//         label: 'sider.configureProduct',
//         open: false,
//         path: '/manage-config/9',
//         requiredRoles: [
//           'admin_business',
//           'mdm_config-manage',
//           'mdm_config-product',
//         ],
//       },
//       {
//         label: 'sider.configureBOM',
//         open: false,
//         path: '/manage-config/16',
//         requiredRoles: [
//           'admin_business',
//           'mdm_config-manage',
//           'mdm_config-product',
//         ],
//       },
//       {
//         label: 'sider.configureMaterial',
//         open: false,
//         path: '/manage-config/10',
//         requiredRoles: [
//           'admin_business',
//           'mdm_config-manage',
//           'mdm_config-product',
//         ],
//       },
//     ],
//   },
//   {
//     label: 'sider.machineManagement',
//     icon: './assets/icons/sider/machineManagement.svg',
//     open: false,
//     path: '/manage-machine-line/manage-machine',
//     children: [],
//     requiredRoles: ['admin_business', 'mdm_machine-management'],
//   },
// ];
