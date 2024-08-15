import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { ManageComponentService } from 'src/app/services/manage-component/manage-component.service';
import { UserService } from 'src/app/services/manage-user/user.service';
import { DATA_TYPE } from 'src/app/utils/constrant';

@Component({
  selector: 'app-add-group',
  templateUrl: './add-group.component.html',
  styleUrls: ['./add-group.component.css'],
})
export class AddGroupComponent {
  constructor(
    private userService: UserService,
    private toast: ToastrService,
    private manageService: ManageComponentService
  ) {}
  groupName: string = '';
  groupCode: string = '';
  authorities: {
    roleCode: string;
    roleName: string;
  }[] = [];
  listRole: any[] = [];
  listGroups: any[] = [];

  roleDetailDtoList: any[] = [];
  requestGroups: Record<string, any> = {};

  checkGroupName: string = '';
  checkGroupCode: string = '';
  checkAuthorities: string = '';

  @Input() isvisible: boolean = false;
  @Output() isvisibleChange: EventEmitter<boolean> = new EventEmitter();

  columnTable: any[] = [];
  listDataAuthorities: any[] = [];

  isvisibleAddGroups: boolean = false;

  ngOnInit() {
    this.columnTable = columnTable;
    this.getRole();
    this.getGroups();
    this.getDataAuthoritiesTable();
  }

  generateGroupCode() {
    this.groupCode = this.groupName
      .toLowerCase()
      .normalize('NFKD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace('đ', 'd')
      .replaceAll(' ', '-')
      .trim();
  }
  getDataAuthoritiesTable() {
    this.userService.getDataAuthorities().then((res) => {
      this.listDataAuthorities = res.data;
    });
  }

  checkValid() {
    if (this.groupName == '') {
      this.checkGroupName = 'Không được bỏ trống tên nhóm';
    } else {
      this.checkGroupName = '';
    }
    if (this.groupCode == '') {
      this.checkGroupCode = 'Không được bỏ trống mã nhóm';
    } else {
      this.checkGroupCode = '';
    }
    if (this.authorities.length == 0) {
      this.checkAuthorities = 'Không được để trống quyền';
    } else {
      this.checkAuthorities = '';
    }
  }

  async handleCancel() {
    this.isvisibleChange.emit(false);
  }

  async getRole() {
    let res = await this.userService.getRole();

    if (res.result.ok) {
      this.listRole = res.data;
    } else {
      this.toast.error(res.result.message);
    }
  }

  async getGroups() {
    let res = await this.userService.getGroups();
    if (res.result.ok) {
      this.listGroups = res.data;
    } else {
      this.toast.error(res.result.message);
    }
  }

  submitDemo() {
    this.isvisibleAddGroups = true;
  }

  async submit() {
    this.checkValid();
    if (this.checkGroupCode) {
      this.toast.warning(this.checkGroupCode);
    } else if (this.checkGroupName) {
      this.toast.warning(this.checkGroupName);
    } else if (this.checkAuthorities) {
      this.toast.warning(this.checkAuthorities);
    } else {
      this.requestGroups['description'] = this.groupName;
      this.requestGroups['name'] = this.groupCode;
      this.requestGroups['roles'] = this.authorities.map((o) => o.roleCode);
      this.requestGroups['listDataAuthority'] = this.listDataAuthorities;
      let res = await this.userService.createGroup(this.requestGroups);
      if (res.result.ok) {
        this.toast.success('Thêm mới nhóm thành công');
        this.isvisibleChange.emit(false);
      } else {
        this.toast.error(res.result.message);
      }
    }
  }
  protected readonly dataType = DATA_TYPE;
}

const columnTable = [
  {
    id: 88,
    index: 1,
    tableName: '',
    keyName: 'tableName',
    keyTitle: 'Bảng',
    isRequired: false,
    dataType: 2,
    hasUnit: false,
    relateTable: null,
    relateColumn: null,
    note: null,
    addition: null,
    width: '120px',
    isFixed: false,
    localCheck: true,
  },
  {
    id: 88,
    index: 1,
    tableName: '',
    keyName: 'columnName',
    keyTitle: 'Cột',
    isRequired: false,
    dataType: 2,
    hasUnit: false,
    relateTable: null,
    relateColumn: null,
    note: null,
    addition: null,
    width: '120px',
    isFixed: false,
    localCheck: true,
  },
  {
    id: 88,
    index: 1,
    tableName: '',
    keyName: 'value',
    keyTitle: 'Giá trị',
    isRequired: false,
    dataType: 9,
    hasUnit: false,
    relateTable: null,
    relateColumn: null,
    note: null,
    addition: null,
    width: '120px',
    isFixed: false,
    localCheck: true,
  },
];
