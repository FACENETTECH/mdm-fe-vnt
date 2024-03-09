import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { UserService } from 'src/app/services/manage-user/user.service';

@Component({
  selector: 'app-infor-user',
  templateUrl: './infor-user.component.html',
  styleUrls: ['./infor-user.component.css']
})
export class InforUserComponent {
  constructor(private userService: UserService, private toast: ToastrService) {}
  // testArr: any[] = ['ADMIN'];
  userName: string = '';
  firstName: string = '';
  lastName: string = '';
  email: string = '';
  password: string = '';
  authorities: any[] = [];
  listavailableRole: any[] = [];
  listeffectiveRole: any[] = [];
  listGroups: any[] = [];
  listGroupsAssign: any[] = [];

  checkUserName: string = '';
  checkAuthor: string = '';
  checkEmail: string = '';
  checkPassword: string = '';

  @Input() isvisible: boolean = false;
  @Output() isvisibleChange: EventEmitter<boolean> = new EventEmitter();

  @Input() user: any = '';

  ngOnInit() {
    this.getRole();
    this.getGroups();
    this.getGroupsbyUserId();

    this.userName = this.user.username;
    this.email = this.user.email;
    this.lastName = this.user.lastName;
    this.firstName = this.user.firstName;
    this.authorities = this.user.authorities;
  }

  checkValid() {
    if (this.userName == '') {
      this.checkUserName = 'Không được bỏ trống username';
    } else {
      this.checkUserName = '';
    }

    // if (this.listavailableRole.length == 0) {
    //   this.checkAuthor = 'Không được để trống role';
    // } else {
    //   this.checkAuthor = '';
    // }

    if (this.listGroupsAssign.length == 0) {
      this.checkAuthor = 'Không được để trống group';
    } else {
      this.checkAuthor = '';
    }

    let regexEmail = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g;

    if (this.email == '') {
      this.checkEmail = '';
    } else {
      if (!regexEmail.test(this.email)) {
        this.checkEmail = 'Email phải có định dạng abc@gmail.com';
      }
    }
  }

  async getGroups() {
    let res = await this.userService.getGroups();
    if (res.result.ok) {
      this.listGroups = res.data;
      console.log('this.listGroups', this.listGroups);
    } else {
      this.toast.error(res.result.message);
    }
  }

  async getGroupsbyUserId() {
    let res = await this.userService.getListGroupsbyUserId(this.user.id);
    if (res.result.ok) {
      // this.listGroupsAssign = list group code from res
      this.listGroupsAssign = res.data.map((item: any) => item.groupCode);
      console.log('this.listGroupsAssign', this.listGroupsAssign);
    } else {
      this.toast.error(res.result.message);
    }
  }

  async getRole() {
    let res = await this.userService.getRoleUser(this.user.id);

    if (res.result.ok) {
      this.listavailableRole = res.data.availableRole;
      this.listeffectiveRole = res.data.effectiveRole;
      this.authorities = res.data.assignedRole;
      this.listavailableRole = [...this.listavailableRole, ...this.authorities];

      console.log('this.authorities', this.authorities);
      // console.log('this.listavailableRole', this.listavailableRole);
    } else {
      this.toast.error(res.result.message);
    }
  }

  async handleCancel() {
    this.isvisibleChange.emit(false);
  }

  isvisibleUpdate: boolean = false;

  submitDemo() {
    this.isvisibleUpdate = true;
    // this.getGroupsbyUserId();
  }

  async submit() {
    this.checkValid();
    if (this.checkUserName) {
      this.toast.warning(this.checkUserName);
    }
    // else if(this.checkEmail){
    //   this.toast.warning(this.checkEmail)
    // }
    else if (this.checkAuthor) {
      this.toast.warning(this.checkAuthor);
    } else {
      let request = {
        username: this.userName,
        firstName: this.firstName,
        lastName: this.lastName,
        email: this.email,
        authorities: this.authorities,
        listGroups: this.listGroupsAssign,
      };

      let res = await this.userService.updateUser(request, this.user.id);
      if (res.result.ok) {
        this.toast.success('Cập nhật thông tin thành công');
        this.isvisibleChange.emit(false);
      } else {
        this.toast.error(res.result.message);
      }
    }
  }
  // compareFn = (o1: any, o2: any): boolean =>
  //   o1 && o2 ? o1.groupCode === o2.groupCode : o1 === o2;
}
