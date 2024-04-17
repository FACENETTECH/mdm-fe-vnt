import { Component, Inject, HostListener } from '@angular/core';
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
import { ConfigService } from 'src/app/services/manage-config/config.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  siderList: any = [];
  isVisableLayout: boolean = false;
  isCheckRefresh: boolean = false;

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
    private manageComponentService: ManageComponentService,
    private toast: ToastrService,
    private configService: ConfigService
  ) {
    let arr = window.location.href.split('/');
    if(arr[arr.length - 1] == 'list-config') {
      this.navigateToConfigTable('/manage-config/config-table/list-config');
    } else if(arr[arr.length - 1] == 'list-account') {
      this.navigateToConfigTable('/manage-account/list-account');
    } else {
      if(arr[arr.length - 1] == '' || arr[arr.length - 1] == 'mdm' || arr[arr.length - 1] == 'mdm-v2') {
        this.isVisableLayout = false;
      } else {
        if(arr[arr.length - 1] == '' || arr[arr.length - 1] == 'mdm') {
          this.isVisableLayout = false;
        } else {
          let baseUrl = JSON.parse(localStorage.getItem('baseUrl')!);
          if(baseUrl.children.length > 0) {
            if(baseUrl.name != arr[arr.length - 2]) {
              this.getListFunctionByName(arr[arr.length - 1], false);
            } else {
              this.getListFunctionByName(baseUrl.name, true, arr[arr.length - 1]);
            }
          } else {
            this.getListFunctionByName(arr[arr.length - 1], false);
          }
        }
      }
    }
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
  lstFunction: any[] = [];

  // Logo
  logoBusiness: string = '';
  nameBusiness: string = '';

  async ngOnInit() {
    this.getInfoBusiness();
    this.getFunctionsByType();

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

  navigateToConfigTable(url: string) {
    this.isVisableLayout = true;
    this._router.navigate([url]);
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
  getListFunctionByName(data: any, check: boolean, childrenName?: any) {
    let sider: any;
    this.manageComponentService.getInforTables(data).subscribe({
      next: (res) => {
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
          if(this.siderList.length > 0) {
            this.siderList.sort((a: any, b: any) => a.index - b.index)
          }
          this.isVisableLayout = true;
          if(check) {
            this._router.navigate([`/mdm/${data}/${childrenName}`]);
          } else {
            this._router.navigate([`/mdm/${data}/${this.siderList[0].name}`]);
          }
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
          this.isVisableLayout = true;
          if(check) {
            this._router.navigate([`/mdm/${data}/${childrenName}`]);
          } else {
            this._router.navigate([`/mdm/${data}`]);
          }
        }
      }, error: (err) => {
        this.toast.error(err.error.result.message);
      }
    })

  }

  /** Block xử lý các chức năng trong phân hệ MDM */
  /** 
   * Đây làm hàm link về trang chứa các phân hệ của hệ thống
  */
  goToHomePage() {
    // this.router.navigateByUrl('/auth/business-acc-setting/home-page')
  }

  /** 
   * Đây là hàm link tới các phân hệ trong hệ thống
   * @param item là biến chứa thông tin của phân hệ di chuyển đến
  */
  directProduct(item: any) {
    console.log(item);
    if(this.isCheckRoles(item.name)) {
      if(item.name == 'manage_account') {
        this.isVisableLayout = true;
        this._router.navigate(['/manage-account/list-account'])
      } else {
        this.isVisableLayout = true;
        this.getListFunctionByName(item.name, false);
      }
    } else {
      this.toast.warning('Tài khoản không có quyền thực hiện chức năng này!');
    }
  }

  /** 
   * Đây là hàm xử lý quyền của tài khoản để trả về giá className phù hợp
   * @param item là biến chứa thông tin của phân hệ di chuyển đến
  */
   getClassByRole(item: any): string {
    if(this.isCheckRoles(item.name)) {
      return 'container-item';
    } else {
      return 'un-active';
    }
  }

  /**
   * Hàm kiểm tra tài khoản có quyền để thực hiện action hay không
   * @param role 
   * @returns 
   */
   isCheckRoles(tableCode: string) {
    if(this.baseService.isAuthorized('admin_business')) {
      return true;
    } else {
      let tenant = '';
      if(this.keycloak.getKeycloakInstance().idTokenParsed != null && this.keycloak.getKeycloakInstance().idTokenParsed != undefined) {
        tenant = this.keycloak.getKeycloakInstance().idTokenParsed!['groups'][0].slice(1);
      }
      let role = tenant + '_mdm_' + tableCode;
      return this.baseService.isAuthorized(role);
    }
  }

  /**
   * Đây là hàm lấy ra danh sách các chức năng của từng phân hệ được phân biệt theo Type
   */
   getFunctionsByType() {
    // Xử lý thông tin phân hệ nhận được từ state trong router và gọi API để lấy ra danh sách chức năng
    this.configService.getAllFunction().subscribe({
      next: (res) => {
        this.lstFunction = res.data;
        this.lstFunction.push({
          "id": 64,
          "name": "manage_account",
          "displayName": "Quản lý tài khoản",
          "label": "quản lý tài khoản",
          "index": 31,
          "isEntity": true,
          "note": null,
          "icon": "./assets/icons/Appstore.svg",
          "color": null,
          "link": "http://dev.fcim.facenet.vn/mdm-v2",
          "parent": null,
          "isVisible": true,
          "children": []
      })
      }, error: (err) => {
        this.toast.error(err.error.message);
      }
    })
  }

  /**
   * Hàm xử lý sự kiện back ở trình duyệt, khi phát hiện được sự kiện sẽ load lại trang với href được lấy ở trong đối Window
   * @param event 
   */
  @HostListener('window:popstate', ['$event'])
  onPopState(event: any) {
    window.location.href = window.location.href;
  }
}