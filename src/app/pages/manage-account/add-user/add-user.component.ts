import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { UserService } from 'src/app/services/manage-user/user.service';

@Component({
  selector: 'app-add-user',
  templateUrl: './add-user.component.html',
  styleUrls: ['./add-user.component.css']
})
export class AddUserComponent {
  constructor(private userService: UserService, private toast: ToastrService) {}

  userName: string = '';
  firstName: string = '';
  lastName: string = '';
  email: string = '';
  password: string = '';
  authorities: any[] = [];
  listRole: any[] = [];
  listGroups: any[] = [];
  listGroupsAssign: any[] = [];

  checkUserName: string = '';
  checkAuthor: string = '';
  checkEmail: string = '';
  checkPassword: string = '';

  @Input() isvisible: boolean = false;
  @Output() isvisibleChange: EventEmitter<boolean> = new EventEmitter();

  isvisibleAdd: boolean = false;

  ngOnInit() {
    this.getRole();
    this.getGroups();
  }

  checkValid() {
    if (this.userName == '') {
      this.checkUserName = 'Không được bỏ trống username';
    } else {
      this.checkUserName = '';
    }

    if (this.password == '') {
      this.checkPassword = 'Không được bỏ trống password';
    } else {
      this.checkPassword = '';
    }

    // if (this.authorities.length == 0) {
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
      this.checkEmail = 'Không được để trống email';
    } else {
      if (!regexEmail.test(this.email)) {
        this.checkEmail = 'Email phải có định dạng abc@gmail.com';
      } else {
        this.checkEmail = '';
      }
    }
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

  async handleCancel() {
    this.isvisibleChange.emit(false);
  }

  submitDemo() {
    this.isvisibleAdd = true;
  }

  async submit() {
    this.checkValid();
    if (this.checkUserName) {
      this.toast.warning(this.checkUserName);
    } else if (this.checkPassword) {
      this.toast.warning(this.checkPassword);
    } else if (this.checkEmail) {
      this.toast.warning(this.checkEmail);
    } else if (this.checkAuthor) {
      this.toast.warning(this.checkAuthor);
    } else {
      let request = {
        username: this.userName,
        firstName: this.firstName,
        lastName: this.lastName,
        email: this.email,
        password: this.password,
        authorities: this.authorities,
        listGroups: this.listGroupsAssign,
      };

      let res = await this.userService.resgisterUser(request);

      if (res.result.ok) {
        this.toast.success('Thêm mới tài khoản thành công');
        this.isvisibleChange.emit(false);
      } else {
        this.toast.error(res.result.message);
      }
    }
  }
}
