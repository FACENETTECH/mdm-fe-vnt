import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { UserService } from 'src/app/services/manage-user/user.service';

@Component({
  selector: 'app-add-group',
  templateUrl: './add-group.component.html',
  styleUrls: ['./add-group.component.css']
})
export class AddGroupComponent {
  constructor(private userService: UserService, private toast: ToastrService) {}
  groupName: string = '';
  groupCode: string = '';
  description: string = '';
  authorities: any[] = [];
  listRole: any[] = [];
  listGroups: any[] = [];

  roleDetailDtoList: any[] = [];
  requestGroups: Record<string, any> = {};

  checkGroupName: string = '';
  checkGroupCode: string = '';
  checkAuthorities: string = '';

  @Input() isvisible: boolean = false;
  @Output() isvisibleChange: EventEmitter<boolean> = new EventEmitter();

  isvisibleAddGroups: boolean = false;

  ngOnInit() {
    this.getRole();
    this.getGroups();
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
      this.requestGroups['groupName'] = this.groupName;
      this.requestGroups['groupCode'] = this.groupCode;
      this.requestGroups['description'] = this.description;
      this.requestGroups['roleDetailDtoList'] = this.authorities;
      this.requestGroups['status'] = 1;
      this.requestGroups['isActived'] = true;
      // console.log(this.requestGroups);

      let res = await this.userService.createGroup(this.requestGroups);
      if (res.result.ok) {
        this.toast.success('Thêm mới nhóm thành công');
        this.isvisibleChange.emit(false);
      } else {
        this.toast.error(res.result.message);
      }
    }
  }
}
