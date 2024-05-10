import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { KeycloakService } from 'keycloak-angular';
import { NzI18nService } from 'ng-zorro-antd/i18n';
import { NzResizeEvent } from 'ng-zorro-antd/resizable';
import { ToastrService } from 'ngx-toastr';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { BaseService } from 'src/app/services/base.service';
import { ManageComponentService } from 'src/app/services/manage-component/manage-component.service';
import { InfoMachineService } from 'src/app/services/manage-machine-line/info-machine/info-machine.service';
import { DATA_TYPE, ROLE_NAME } from 'src/app/utils/constrant';

@Component({
  selector: 'app-list-template',
  templateUrl: './list-template.component.html',
  styleUrls: ['./list-template.component.css']
})
export class ListTemplateComponent {
  classList: any = {
    searchTree: "search-tree-container-close",
    content: "content-container-close",
  }
  breadcrumbs = [
    {
      name: 'Quản lý biểu mẫu',
      route: `/manage-template/list-template`,
    },
  ];
  pageNumber: number = 1;
  pageSize: number = 20;
  total: number = 0;
  common: string = '';
  optionsComplete: any[] = [];
  propertySort: string | null = 'index';
  orderSort: string = 'DESC';
  sortColumn: string = '';
  isInputFocused: boolean = false; // Lưu trữ giá trị khi focus hoặc blur ra khỏi ô input
  columns: any[] = [];
  listTemplate: any[] = [];
  inforTemplateForm: Record<string, any> = {};
  count = 0;
  valueSelectBox: any = []; // Lưu trữ các giá trị của những trường có type là select box
  currentTemplate: any = '';
  columnKey: string = ''; // Lưu trữ column được coi là khoá của bảng

  isvisibleAdd: boolean = false;
  ivisibleInfor: boolean = false;
  isvisibleUpdate: boolean = false;
  isvisibleDelete: boolean = false;
  isvisibleCopy: boolean = false;
  isvisibleDeleteList: boolean = false;
  checked = false;
  indeterminate = false;
  setOfCheckedId = new Set<number>();
  noDataFound: boolean = false;
  columnSort: any[] = [];

  constructor(
    private http: HttpClient,
    private machineService: InfoMachineService,
    private toast: ToastrService,
    private actRoute: ActivatedRoute,
    private loader: NgxUiLoaderService,
    private i18n: NzI18nService,
    private manageComponentService: ManageComponentService,
    private router: Router,
    private baseService: BaseService,
    private keyCloak: KeycloakService,
  ) {}

  ngOnInit() {
    this.getHeaders();
  }

  getHeaders() {
    this.manageComponentService.getColummnByTableName('template_form').subscribe({
      next: (res) => {
        this.columns = res.data;
        for(let i = 0; i < this.columns.length; i++) {
          this.columns[i].localCheck = true;
        }
        for(let i = 0; i < this.columns.length; i++) {
          if(this.columns[i].isCode) {
            this.columnKey = this.columns[i].keyName;
            break;
          }
        }
        this.getData({ page: this.pageNumber, size: this.pageSize });
      }, error: (err) => {
        this.toast.error(err.error.result.message);
      }
    })
  }

  search($event: any) {
    if ($event.keyCode === 13) {
      const searchData = {
        page: this.pageNumber,
        size: this.pageSize,
      };

      this.getData(searchData);
    }
  }

  searchSelectBox($event: any) {
    const searchData = {
      page: this.pageNumber,
      size: this.pageSize,
    };
    this.getData(searchData);
  }

  async searchCommon() {
    this.optionsComplete = [];
    let request = {
      pageNumber: 0,
      pageSize: 10,
      common: this.common.trim(),
      filter: { machineType: {} },
      sortOrder: this.orderSort,
      sortProperty: this.propertySort,
    };

    setTimeout(async () => {
      let res = await this.machineService.serachCommon(request);
      if (res.result.ok) {
        if (this.common) {
          res.data.map((x: string) => {
            this.optionsComplete.push(x);
          });
        }
      }
    });
  }

  async commonAutoComplete(value: string) {
    this.manageComponentService.getCommonAutoComplete('template_form', value).subscribe({
      next: (res) => {
        this.optionsComplete = res.data;
      }, error: (err) => {
        this.toast.error(err.error.result.message);
      }
    });
  }

  /**
   * Thay đổi giá trị biến isInputFocused thành true khi focus vào ô input
   */
  onInputFocus() {
    this.isInputFocused = true;
  }

  /**
   * Thay đổi giá trị biến isInputFocused thành false khi blur vào ô input
   */
  onInputBlur() {
    this.isInputFocused = false;
  }

  addTemplateForm() {
    this.isvisibleAdd = true;
  }

  openPopupCopy() {
    if(this.setOfCheckedId.size > 0) {
      this.isvisibleCopy = true;
    } else {
      this.toast.warning("Vui lòng chọn bản ghi để sử dụng chức năng này!")
    }
  }

  openPopupDeleteList() {
    if(this.setOfCheckedId.size > 0) {
      this.isvisibleDeleteList = true;
    } else {
      this.toast.warning("Vui lòng chọn bản ghi để sử dụng chức năng này!")
    }
  }

  changeColumn() {
    localStorage.setItem('machine', JSON.stringify(this.columns));
  }

  /**
   * Đây là hàm chọn tất cả các bản ghi trong bảng
   * @param value : đây là thông tin từng bản ghi
   */
  onAllChecked(value: boolean): void {
    this.listTemplate.forEach(item => this.updateCheckedSet(item.id, value));
    this.refreshCheckedStatus();
  }

  /**
   * Đây là hàm chọn từng bản ghi trong bảng
   * @param id : id của từng bản ghi
   * @param checked : lữu trữ giá trị chọn hay không chọn của bản ghi
   */
  onItemChecked(id: number, checked: boolean): void {
    this.updateCheckedSet(id, checked);
    this.refreshCheckedStatus();
  }

  /**
   * Đây là hàm update các bản ghi được chọn vào biến Set
   * @param id : id của từng bản ghi
   * @param checked : lữu trữ giá trị chọn hay không chọn của bản ghi
   */
  updateCheckedSet(id: number, checked: boolean): void {
    if (checked) {
      this.setOfCheckedId.add(id);
    } else {
      this.setOfCheckedId.delete(id);
    }
  }

  /**
   * Đây là hoàn bỏ check tất cả các bạn ghi hiện tại được chọn
   */
  refreshCheckedStatus(): void {
    this.checked = this.listTemplate.every(item => this.setOfCheckedId.has(item.id));
    this.indeterminate = this.listTemplate.some(item => this.setOfCheckedId.has(item.id)) && !this.checked;
  }

  /**
   * Đây là hàm xử lý sự kiện thay đổi vị trí hàng trong bảng
   * @param event : là thông tin về hàng được thay đổi vị trí
   */
  async drop(event: CdkDragDrop<string[], string, any>) {
    moveItemInArray(this.listTemplate, event.previousIndex, event.currentIndex);
    if(event.previousIndex < event.currentIndex) {
      this.listTemplate[event.currentIndex].index = this.listTemplate[event.currentIndex - 1].index;
      this.manageComponentService.updateInforRecordById(
        'template_form', 
        this.listTemplate[event.currentIndex].id, 
        this.listTemplate[event.currentIndex]
      ).subscribe({
        next: (res) => {
        }, error: (err) => {
          this.toast.error(err.error.result.message);
        }
      })
    } else {
      this.listTemplate[event.currentIndex].index = this.listTemplate[event.currentIndex + 1].index;
      this.manageComponentService.updateInforRecordById(
        'template_form', 
        this.listTemplate[event.currentIndex].id, 
        this.listTemplate[event.currentIndex]
      ).subscribe({
        next: (res) => {

        }, error: (err) => {
          this.toast.error(err.error.result.message);
        }
      })
    }
  }

  id = -1;
  onResize({ width }: NzResizeEvent, i: number): void {
    cancelAnimationFrame(this.id);
    this.id = requestAnimationFrame(() => {
      this.columns[i].width = width + 'px';
    });
  }

  customSortFunction(event: any, sortColumn: string) {
    this.count = this.count + 1;
    if (this.count % 3 == 1) {
      this.orderSort = 'DESC';
      this.propertySort = null;
    } else if (this.count % 3 == 2) {
      this.propertySort = null;
      this.orderSort = 'ASC';
    } else {
      this.orderSort = 'DESC';
      this.propertySort = 'createdAt';
    }
    this.propertySort = sortColumn;

    this.getData({ page: this.pageNumber, size: this.pageSize });
  }

  clearInput(keyName: string) {
    if (keyName == 'machinetype') {
      this.inforTemplateForm[keyName]['machineTypeName'] = '';
    } else {
      this.inforTemplateForm[keyName] = '';
    }
  }

  /**
   * Hàm gọi API và xử lý dữ liệu option cho select box
   */
  handleOpenChangeDataTypeParam(data: any, column: any) {
    if(data) {
      this.manageComponentService.getParamByTableNameAndColumnName(column.tableName, column.keyName).subscribe({
        next: (res) => {
          this.valueSelectBox = res.data;
        }, error: (err) => {
          this.toast.error(err.error.result.message);
        }
      })
    }
  }

  /**
   * Xử lý sự kiện double click trên dòng trong table
   */
  onDblClickOnRowTable(infor: any) {
    if(this.isCheckRoles('view-detail')) {
      this.editMachine(infor);
    }
  }

  editMachine(infor: any) {
    this.currentTemplate = infor;
    this.isvisibleUpdate = true;
  }

  viewInforComponent(infor: any) {
    this.currentTemplate = infor;
    this.ivisibleInfor = true;
  }

  deleteMachine(machine: any) {
    this.currentTemplate = machine;
    this.isvisibleDelete = true;
  }

  async getData(page: { page: number; size: number }) {
    this.pageNumber = page.page;
    this.pageSize = page.size;
    let request = {
      pageNumber: page.page - 1,
      pageSize: page.size,
      common: this.common.trim(),
      filter: this.inforTemplateForm,
      sortOrder: this.orderSort,
      sortProperty: this.propertySort
    };

    this.loader.start();
    this.manageComponentService.getDataDynamicTable('template_form', request).subscribe({
      next: (res) => {
        this.listTemplate = res.data;
        this.total = res.dataCount;
        for (let j = 0; j < this.columns.length; j++) {
          let compare: Record<string, any> = {};
          compare[this.columns[j].keyName] = this.columns[j].keyName;
          compare['compare'] = (a: any, b: any) =>
            a[this.columns[j].keyName].localeCompare(b[this.columns[j].keyName]);
          this.columnSort.push(compare);
        }
    
        this.total = res.dataCount;
        if (this.listTemplate.length == 0) {
          this.noDataFound = true;
        } else {
          this.noDataFound = false;
        }
        this.loader.stop();
      }, error: (err) => {
        this.toast.error(err.error.result.message);
        this.loader.stop();
      }
    })
  }

  /**
   * Đây là hàm sinh ra mã ngẫu nhiên
   * @param length chiều dài chuỗi cần random
   * @returns 
   */
  makeid(length: number) {
    let result = '';
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const charactersLength = characters.length;
    let counter = 0;
    while (counter < length) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
      counter += 1;
    }
    return result;
  }

  /**
   * Đây là hàm xử lý xự kiện copy và gọi API để lưu dữ liệu
   */
  submitCopy() {
    this.loader.start();
    let code = '';
    let request: any = [];
    for(let i = 0; i < this.columns.length; i++) {
      if(this.columns[i].isCode) {
        code = this.columns[i].keyName;
        break;
      }
    }
    if(code !== '') {
      this.setOfCheckedId.forEach((item) => {
        for(let i = 0; i < this.listTemplate.length; i++) {
          if(item == this.listTemplate[i].id) {
            request.push(this.listTemplate[i]);
            break;
          }
        }
      })
      if(request.length > 0) {
        for(let i = 0; i < request.length; i++) {
          request[i][code] = request[i][code] + "-" + this.makeid(4);
        }
        this.manageComponentService.addListRecord('template_form', request).subscribe({
          next: (res) => {
            this.toast.success(res.result.message);
            this.setOfCheckedId = new Set<number>();
            this.refreshCheckedStatus();
            this.getData({ page: this.pageNumber, size: this.pageSize });
            this.loader.stop();
          }, error: (err) => {
            this.toast.error(err.error.result.message);
            this.setOfCheckedId = new Set<number>();
            this.refreshCheckedStatus();
            this.loader.stop();
          }
        })
      } else {
        this.loader.stop();
      }
    } else {
      this.loader.stop();
    }
  }

  /**
   * Hàm load lại dữ liệu sau khi người dùng có thay đổi dữ liệu và đóng popup
   * @param event 
   */
  async addColumnConfirm(event: any) {
    if(event) {
      this.getData({ page: this.pageNumber, size: this.pageSize });
    }
  }


  deleteConfirm(event: any) {
    this.manageComponentService.deleteRecordById('template_form', this.currentTemplate.id).subscribe({
      next: (res) => {
        this.toast.success(res.result.message);
        this.getData({ page: this.pageNumber, size: this.pageSize });
      }, error: (err) => {
        this.toast.error(err.error.result.message);
      }
    })
  }

  deleteListConfirm(event: any) {
    let request: any = [];
    this.setOfCheckedId.forEach((item) => {
      request.push(item);
    })
    this.manageComponentService.deleteListRecordByListId('template_form', request).subscribe({
      next: (res) => {
        this.toast.success(res.result.message);
        this.setOfCheckedId = new Set<number>();
        this.refreshCheckedStatus();
        this.getData({ page: this.pageNumber, size: this.pageSize });
      }, error: (err) => {
        this.toast.error(err.error.result.message);
      }
    })
  }

  /**
   * Hàm kiểm tra tài khoản có quyền để thực hiện action hay không
   * @param role 
   * @returns 
   */
  isCheckRoles(action: string) {
    if(this.baseService.isAuthorized('admin_business')) {
      return true;
    } else {
      let tenant = '';
      if(this.keyCloak.getKeycloakInstance().idTokenParsed != null && this.keyCloak.getKeycloakInstance().idTokenParsed != undefined) {
        tenant = this.keyCloak.getKeycloakInstance().idTokenParsed!['groups'][0].slice(1);
      }
      let role = tenant + '_mdm_template_form' + '_' + action;
      return this.baseService.isAuthorized(role);
    }

  }

  protected readonly dataType = DATA_TYPE;
  protected readonly roleName = ROLE_NAME;
}
