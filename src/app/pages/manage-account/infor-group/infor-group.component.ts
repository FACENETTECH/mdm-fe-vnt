import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { UserService } from 'src/app/services/manage-user/user.service';

@Component({
  selector: 'app-infor-group',
  templateUrl: './infor-group.component.html',
  styleUrls: ['./infor-group.component.css']
})
export class InforGroupComponent {
  constructor(private userService: UserService, private toast: ToastrService) {}
  
  @Input() isvisible: boolean = false;
  @Input() group: any;
  
  groupName: string = '';
  groupCode: string = '';
  authorities: {
    roleCode: string,
    roleName: string
  }[] = [];
  assignedRoles: any[] = [];
  listRole: any[] = [];
  listGroups: any[] = [];

  roleDetailDtoList: any[] = [];
  requestGroups: Record<string, any> = {};

  checkGroupName: string = '';
  checkGroupCode: string = '';
  checkAuthorities: string = '';

  @Output() isvisibleChange: EventEmitter<boolean> = new EventEmitter();

  isvisibleUpdateGroup: boolean = false;

  ngOnInit() {
    this.groupCode = this.group.name;
    this.groupName = this.group.description;
    this.getRole();
    this.getGroup(this.groupCode);
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

  async getGroup(groupCode: string) {
    let res = await this.userService.getGroup(groupCode);
    if (res.result.ok) {
      // this.authorities = res.data.map((o: any) => o.description);
      this.authorities = res.data.map((o: any) => {
        return {
          roleCode: o.name,
          roleName: o.description
        }
      })
      console.log(this.authorities);
    } else {
      this.toast.error(res.result.message);
    }
  }

  submitDemo() {
    this.isvisibleUpdateGroup = true;
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
      this.requestGroups['roles'] = this.authorities.map(o => o.roleCode);

      let res = await this.userService.updateGroup(
        this.requestGroups
      );
      if (res.result.ok) {
        this.toast.success(res.result.message);
        this.isvisibleChange.emit(false);
      } else {
        this.toast.error(res.result.message);
      }
    }
  }

  compareFn = (o1: any, o2: any): boolean =>
    o1 && o2 ? o1.roleName === o2.roleName : o1 === o2;
}
