import { Component } from '@angular/core';
import { KeycloakService } from 'keycloak-angular';
import { NzResizeEvent } from 'ng-zorro-antd/resizable';
import { ToastrService } from 'ngx-toastr';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { ExportService } from 'src/app/services/export.service';
import { UserService } from 'src/app/services/manage-user/user.service';

@Component({
  selector: 'app-list-account',
  templateUrl: './list-account.component.html',
  styleUrls: ['./list-account.component.css']
})
export class ListAccountComponent {
  constructor(
    private userService: UserService,
    private toast: ToastrService,
    private keycloak: KeycloakService,
    private loader: NgxUiLoaderService,
    private exportService: ExportService
  ) {}

  listUser: any[] = [];
  header: any[] = [
    {
      name: 'Username',
      width: '',
    },
    {
      name: 'Email',
      width: '',
    },
    {
      name: 'FirstName',
      width: '',
    },
    {
      name: 'LastName',
      width: '',
    },
  ];

  data: any[] = [
    {
      id: 1,
      name: 'Thêm lỗi',
      note: 'Quyền thêm lỗi',
    },
    {
      id: 2,
      name: 'Sửa lỗi',
      note: 'Quyền sửa lỗi',
    },
    {
      id: 3,
      name: 'Xóa lỗi',
      note: 'Quyền Xóa lỗi',
    },
  ];

  listGroup: any[] = [];

  accListMode: boolean = true;

  listUserToExport: any[] = [];

  total: number = 100;
  pageSize: number = 10;
  pageNumber: number = 1;

  pageSizeGroups: number = 10;
  pageNumberGroups: number = 1;

  isvisibleDelete: boolean = false;
  isvisibleDeleteGroup: boolean = false;
  isvisibleAdd: boolean = false;
  isvisibleAddGroups: boolean = false;
  isvisibleUpdate: boolean = false;
  isvisibleUpdateGroup: boolean = false;

  currentUser: any = '';
  currentGroup: any = '';

  common: string = '';
  username: string = '';
  email: string = '';
  firstName: string = '';
  lastName: string = '';
  authorities: any[] = [];
  listRole: any[] = [];

  optionsComplete: any[] = [];

  breadcrumbs: any[] = [
    {
      name: 'Quản lý tài khoản',
      route: `/manage-user/`,
    },
    {
      name: 'Danh sách tài khoản',
      route: `/manage-user/list-user`,
    },
  ];

  ngOnInit() {
    console.log(this.keycloak);
    this.getUser({ page: this.pageNumber, size: this.pageSize });
    this.getRole();
    this.getListGroups({
      page: this.pageNumberGroups,
      size: this.pageSizeGroups,
    });
  }

  accList() {
    this.accListMode = true;
  }

  permissionList() {
    this.accListMode = false;
  }

  async getRole() {
    let res = await this.userService.getRole();

    if (res.result.ok) {
      this.listRole = res.data;
    } else {
      this.toast.error(res.result.message);
    }
  }

  async searchAutoComplete(col: any) {
    let request = {
      pageNumber: 0,
      pageSize: 10,
      common: '',
      filter: {
        username: this.username,
        firstName: this.firstName,
        lastName: this.lastName,
        email: this.email,
        authorities: this.authorities,
      },
    };

    let res = await this.userService.getListUser(request);
    if (res.result.ok) {
      this.optionsComplete = [];
      let listUser = res.data;
      listUser.map((x: any) => {
        this.optionsComplete.push(x[col]);
      });
    } else {
      this.toast.error(res.result.message);
    }
  }

  async getUser(page: { page: number; size: number }) {
    this.pageSize = page.size;
    this.pageNumber = page.page;
    let request = {
      pageNumber: this.pageNumber - 1,
      pageSize: this.pageSize,
      common: this.common,
      filter: {
        username: this.username,
        firstName: this.firstName,
        lastName: this.lastName,
        email: this.email,
        authorities: this.authorities,
      },
    };

    this.loader.start();
    let res = await this.userService.getListUser(request);
    this.loader.stop();
    if (res.result.ok) {
      this.listUser = res.data;
      this.total = res.dataCount;
      console.log('[Hoang] List User: ', this.listUser);
    } else {
      this.toast.error(res.result.message);
    }
  }

  async getListGroups(page: { page: number; size: number }) {
    this.pageSizeGroups = page.size;
    this.pageNumberGroups = page.page;
    let request = {
      pageNumber: this.pageNumberGroups - 1,
      pageSize: this.pageSizeGroups,
      common: this.common,
      filter: {},
    };
    this.loader.start();
    let res = await this.userService.getListGroups(request);
    this.loader.stop();
    if (res.result.ok) {
      this.listGroup = res.data;
    } else {
      this.toast.error(res.result.message);
    }
  }
  noDataFound: boolean = false;
  search($event: any) {
    if ($event.keyCode == 13) {
      this.getUser({ page: this.pageNumber, size: this.pageSize });
      this.noDataFound = this.total > 0 ? false : true;
    }
  }

  searchSelectBox($event: any) {
    this.getUser({ page: this.pageNumber, size: this.pageSize });
  }

  addUser() {
    this.isvisibleAdd = true;
  }

  addGroups() {
    this.isvisibleAddGroups = true;
    console.log('add groups');
  }

  updateUser(user: any) {
    this.currentUser = user;
    this.isvisibleUpdate = true;
  }

  updateGroup(group: any) {
    this.currentGroup = group;
    this.isvisibleUpdateGroup = true;
  }

  childOut() {
    this.getUser({ page: this.pageNumber, size: this.pageSize });
  }
  childOutGroups() {
    this.getListGroups({ page: this.pageNumber, size: this.pageSize });
  }

  deleteUser(user: any) {
    this.isvisibleDelete = true;
    this.currentUser = user;
  }

  deleteGroup(group: any) {
    this.isvisibleDeleteGroup = true;
    this.currentGroup = group;
  }

  closeDelete() {
    this.isvisibleDelete = false;
  }

  async deleteConfirm() {
    let res = await this.userService.deleteUser(this.currentUser.id);
    if (res.result.ok) {
      this.toast.success(
        `Xóa tài khoản ${this.currentUser.username} thành công`
      );
      this.getUser({ page: this.pageNumber, size: this.pageSize });
      this.closeDelete();
    } else {
      this.toast.error(res.result.message);
    }
  }

  async deleteGroupConfirm() {
    let res = await this.userService.deleteGroup(this.currentGroup.name);
    if (res.result.ok) {
      this.toast.success(`Xóa nhóm ${this.currentGroup.description} thành công`);
      this.getListGroups({ page: this.pageNumber, size: this.pageSize });
      this.isvisibleDeleteGroup = false;
    } else {
      this.toast.error(res.result.message);
    }
  }

  async export() {
    let headers: any[] = [];
    this.header.map((x: any) => {
      headers.push(x.name);
    });

    let request = {
      pageNumber: 0,
      pageSize: 0,
      filter: {
        username: '',
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        authorities: [],
      },
    };

    let res = await this.userService.getListUser(request);

    res.data.map((x: any) => {
      this.listUserToExport.push({
        username: x.username,
        email: x.email,
        firstName: x.firstName,
        lastName: x.lastName,
        // authorities: x.authorities.toString(),
      });
    });

    this.exportService.exportExcel(this.listUserToExport, 'UserList', headers);
  }

  id = -1;
  onResize({ width }: NzResizeEvent, i: number) {
    cancelAnimationFrame(this.id);
    this.id = requestAnimationFrame(() => {
      this.header[i].width = width + 'px';
    });
  }
}
