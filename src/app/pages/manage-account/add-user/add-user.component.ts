import { Component, EventEmitter, Input, Output } from '@angular/core';
import { KeycloakService } from 'keycloak-angular';
import { ToastrService } from 'ngx-toastr';
import { debounceTime } from 'rxjs';
import { ManageComponentService } from 'src/app/services/manage-component/manage-component.service';
import { UserService } from 'src/app/services/manage-user/user.service';

@Component({
  selector: 'app-add-user',
  templateUrl: './add-user.component.html',
  styleUrls: ['./add-user.component.css']
})
export class AddUserComponent {
  constructor(
    private userService: UserService,
    private toast: ToastrService,
    private manageService: ManageComponentService,
    private keycloak: KeycloakService,
  ) {}

  usernameSuffix: string = '';
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

  lastSearchMillis = 0;
  employeeSearchName: string = '';
  employeeSearchCode: string = '';
  selectedEmployee: any = {};
  allEmployees: any[] = [];
  employees: any[] = [];
  employeePopoverVisible: boolean = false;

  @Input() isvisible: boolean = false;
  @Output() isvisibleChange: EventEmitter<boolean> = new EventEmitter();

  isvisibleAdd: boolean = false;

  ngOnInit() {
    this.usernameSuffix = '@' + this.keycloak.getUsername().split("@")[1];
    this.getRole();
    this.getGroups();
    this.getEmployees();
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

  getEmployees() {
    let request = {
      pageNumber: 0,
      pageSize: 0,
      filter: {
        employee_name: this.employeeSearchName,
        employee_code: this.employeeSearchCode,
      },
      sortOrder: "ASC",
      sortProperty: "employee_name",
    }
    this.manageService.getDataDynamicTable("employee", request).subscribe({
      next: (res) => {
        this.allEmployees = res.data;
        this.employees = this.allEmployees;
      }, error: (res) => {
        console.error(res.result.message);
      }
    });
  }

  searchEmployees() {
    this.employees = this.allEmployees.filter(employee => 
      this.unaccent(employee.employee_name).includes(this.unaccent(this.employeeSearchName)) &&
      this.unaccent(employee.employee_code).includes(this.unaccent(this.employeeSearchCode))
    );
  }

  unaccent(value: string): string {
    return value.toLowerCase().normalize("NFKD").replace(/[\u0300-\u036f]/g, '');
  }

  toggleEmployeePopover() {
    this.employeePopoverVisible = !this.employeePopoverVisible;
  }

  handleEmployeeChanged(employee: any) {
    this.toggleEmployeePopover();
    this.selectedEmployee = employee;
    this.firstName = employee.first_name;
    this.lastName = employee.last_name;
    this.email = employee.user_email;
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
        username: this.userName + this.usernameSuffix,
        firstName: this.firstName,
        employeeCode: this.selectedEmployee.employee_code,
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
