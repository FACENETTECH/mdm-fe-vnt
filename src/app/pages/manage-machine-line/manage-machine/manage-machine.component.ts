import { Component, OnInit, HostListener, OnDestroy } from '@angular/core';
import { NzResizeEvent } from 'ng-zorro-antd/resizable';
import { ToastrService } from 'ngx-toastr';
import { InfoMachineService } from 'src/app/services/manage-machine-line/info-machine/info-machine.service';
import { saveAs } from 'file-saver';
import * as XLSX from 'xlsx';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environment/environment';
import { ExportService } from 'src/app/services/export.service';
import { count } from 'rxjs';
import { ActivatedRoute, Router, NavigationEnd, Event } from '@angular/router';
import { NzI18nService, en_US } from 'ng-zorro-antd/i18n';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { DATA_TYPE } from 'src/app/utils/constrant';
import { InforColumnComponent } from 'src/app/shared/components/infor-column/infor-column.component';
import { ManageComponentService } from 'src/app/services/manage-component/manage-component.service';
@Component({
  selector: 'app-manage-machine',
  templateUrl: './manage-machine.component.html',
  styleUrls: ['./manage-machine.component.css'],
})
export class ManageMachineComponent implements OnInit, OnDestroy {
  // New variables for dynamic form
  checked = false;
  indeterminate = false;
  setOfCheckedId = new Set<number>();

  constructor(
    private exportService: ExportService,
    private http: HttpClient,
    private machineService: InfoMachineService,
    private toast: ToastrService,
    private actRoute: ActivatedRoute,
    private loader: NgxUiLoaderService,
    private i18n: NzI18nService,
    private manageComponentService: ManageComponentService,
    private router: Router,
  ) {
    this.router.events.subscribe((e: Event) => {
      if (e instanceof NavigationEnd) {
        this.ngOnInit();
      }
    });
  }
  pageNumber: number = 1;
  pageSize: number = 20;
  total: number = 0;
  common: string = '';

  machineCode: string = '';
  machineName: string = '';
  status: string = '';
  machineType: string = '';
  productivity: string = '';
  description: string = '';
  supplier: string = '';
  maintenanceTime: string = '';
  minProductionQuantity: string = '';
  maxProductionQuantity: string = '';
  purchaseDate: string = '';
  maxWaitingTime: string = '';
  cycleTime: string = '';
  columnSort: any[] = [];
  isvisibleImport: boolean = false;
  isvisibleAddColumn: boolean = false;

  listMachine: any[] = [];
  columns: any[] = [];
  columnNames: string[] = [];
  expandSet = new Set<number>();
  isExpand: boolean = false;

  isvisibleAdd: boolean = false;
  ivisibleInfor: boolean = false;
  isvisibleUpdate: boolean = false;
  isvisibleDelete: boolean = false;
  isvisibleCopy: boolean = false;
  isvisibleDeleteList: boolean = false;
  currentMachine: any = '';
  inforTable: any;
  count = 0;
  inforMachine: Record<string, any> = {};
  valueSelectBox: any = []; // Lưu trữ các giá trị của những trường có type là select box
  tableName: string = ''; // Lưu trữ giá trị tên bảng viết hoa
  tableCode: string = '';
  columnKey: string = ''; // Lưu trữ column được coi là khoá của bảng
  isInputFocused: boolean = false; // Lưu trữ giá trị khi focus hoặc blur ra khỏi ô input

  // Dữ liệu cho cây tìm kiếm
  selectedOptions: string[] = [];
  searchTreeName: string = "";
  searchTreeOptions: {
    value: string,
    checked: boolean
  }[] = [];

  treeVisible: boolean = false;

  classList: any = {
    searchTree: "search-tree-container-close",
    content: "content-container-close",
  }

  breadcrumbs = [
    {
      name: 'menu.management_machine',
      route: `/manage-machine-line/manage-machine`,
    },
  ];

  formatDate(inputDate: string): string {
    if (!inputDate) return '';

    const dateObj = new Date(inputDate);
    const isDateValid = !isNaN(dateObj.getTime());

    if (!isDateValid) return inputDate;

    const day = dateObj.getDate().toString().padStart(2, '0');
    const month = (dateObj.getMonth() + 1).toString().padStart(2, '0');
    const year = dateObj.getFullYear();

    return `${day}-${month}-${year}`;
  }
  ngOnInit() {
    console.log()
    this.inforTable = JSON.parse(localStorage.getItem('baseUrl')!);
    if(this.inforTable.children.length > 0) {
      this.tableCode = localStorage.getItem('currentSider')!;
    } else {
      this.tableCode = this.inforTable.name
    }
    this.breadcrumbs[0].name = this.inforTable.displayName;
    this.tableName = this.inforTable.displayName.toUpperCase();
    this.getHeaders();
  }

  clearInput(keyName: string) {
    if (keyName == 'machinetype') {
      this.inforMachine[keyName]['machineTypeName'] = '';
    } else {
      this.inforMachine[keyName] = '';
    }
  }

  async addColumnConfirm(event: any) {
    if(event) {
      this.getData({ page: this.pageNumber, size: this.pageSize });
    }
  }

  noDataFound: boolean = false;
  visible: boolean = false;

  clickMe(): void {
    this.visible = false;
  }

  change(value: boolean): void {}
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

  optionsComplete: any[] = [];

  async searchAutoComplete(keyName: string) {}

  isNumeric(value: any): boolean {
    return !isNaN(parseFloat(value)) && isFinite(value);
  }
  isDate(value: any): boolean {
    return value instanceof Date;
  }
  isNumericOrDate(value: any): boolean {
    return this.isNumeric(value) || this.isDate(value);
  }

  propertySort: string | null = 'index';
  orderSort: string = 'DESC';
  sortColumn: string = '';
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
  async getColumn() {
    this.inforMachine['machineType'] = {};

    let request = {
      pageNumber: 0,
      pageSize: 0,
      common: '',
      filter: this.inforMachine,
    };

    let res = await this.machineService.getMachine(request);
  }
  decodeTimeStringToSecond(input: string): number | null {
    if (input.length > 0) {
      const decodedString = input.split(' ');
      if (decodedString.length > 1) {
        if (decodedString[1] == 'tháng')
          return Number(decodedString[0]) * 2592000;
        if (decodedString[1] == 'ngày') return Number(decodedString[0]) * 86400;
        if (decodedString[1] == 'giờ') return Number(decodedString[0]) * 3600;
        if (decodedString[1] == 'phút') return Number(decodedString[0]) * 60;
        if (decodedString[1] == 'giây') return Number(decodedString[0]);
      } else {
        return Number(decodedString[0]);
      }
    }
    return null;
  }
  async getData(page: { page: number; size: number }) {
    this.pageNumber = page.page;
    this.pageSize = page.size;
    let request = {
      pageNumber: page.page - 1,
      pageSize: page.size,
      common: this.common.trim(),
      filter: this.inforMachine,
      sortOrder: this.orderSort,
      sortProperty: this.propertySort,
      searchOptions: this.selectedOptions,
    };

    this.loader.start();
    this.manageComponentService.getDataDynamicTable(this.tableCode, request).subscribe({
      next: (res) => {
        console.log(res);
        this.listMachine = res.data;
        this.total = res.dataCount;
        for (let j = 0; j < this.columns.length; j++) {
          let compare: Record<string, any> = {};
          compare[this.columns[j].keyName] = this.columns[j].keyName;
          compare['compare'] = (a: any, b: any) =>
            a[this.columns[j].keyName].localeCompare(b[this.columns[j].keyName]);
          this.columnSort.push(compare);
        }
    
        this.total = res.dataCount;
        this.columns.map((x: any) => {
          this.stageTemplate[x.keyTitle] = '';
        });
        // this.columns.map((x: any) => {
        //   if (x.keyName != 'status') {
        //     x.width = '300px';
        //   } else {
        //     x.width = '150px';
        //   }
        // });
        this.listMachineToExport = [];
        this.listMachineTemplate.push(this.stageTemplate);
        if (this.listMachine.length == 0) {
          this.noDataFound = true;
        } else {
          this.noDataFound = false;
        }
        this.loader.stop();
        console.log('List Manchine: ', this.listMachine);
      }
    })
  }
  changeColumn() {
    localStorage.setItem('machine', JSON.stringify(this.columns));
  }

  reorderColumns(
    columns: any[],
    columnName: string,
    beforeColumnName: string
  ): any[] {
    const statusColumnIndex = columns.findIndex(
      (col) => col.keyName === columnName
    );
    const beforeColumnIndex = columns.findIndex(
      (col) => col.keyName === beforeColumnName
    );

    if (statusColumnIndex !== -1 && beforeColumnIndex !== -1) {
      const statusColumn = columns.splice(statusColumnIndex, 1)[0];
      columns.splice(beforeColumnIndex, 0, statusColumn);
    }

    return columns;
  }
  stageTemplate: Record<string, any> = {};
  listMachineTemplate: any[] = [];
  listMachineToExport: any[] = [];
  addMachine() {
    this.isvisibleAdd = true;
    console.log("record choose: ", this.setOfCheckedId);
  }

  childOut() {
    this.getData({ page: this.pageNumber, size: this.pageSize });
  }

  inforComponent(infor: any) {
    this.currentMachine = infor;
    this.ivisibleInfor = true;
  }

  editMachine(machine: any) {
    this.currentMachine = machine;
    this.isvisibleUpdate = true;
  }

  deleteMachine(machine: any) {
    this.currentMachine = machine;
    this.isvisibleDelete = true;
  }

  openPopupCopy() {
    console.log(this.setOfCheckedId.size);
    if(this.setOfCheckedId.size > 0) {
      this.isvisibleCopy = true;
    } else {
      this.toast.warning("Vui lòng chọn bản ghi để sử dụng chức năng này!")
    }
  }

  openPopupDeleteList() {
    console.log(this.setOfCheckedId.size);
    if(this.setOfCheckedId.size > 0) {
      this.isvisibleDeleteList = true;
    } else {
      this.toast.warning("Vui lòng chọn bản ghi để sử dụng chức năng này!")
    }
  }

  deleteConfirm(event: any) {
    this.manageComponentService.deleteRecordById(this.tableCode, this.currentMachine.id).subscribe({
      next: (res) => {
        this.toast.success(res.result.message);
        this.getData({ page: this.pageNumber, size: this.pageSize });
      }, error: (err) => {
        this.toast.error(err.result.message);
      }
    })
  }

  deleteListConfirm(event: any) {
    let request: any = [];
    this.setOfCheckedId.forEach((item) => {
      request.push(item);
    })
    this.manageComponentService.deleteListRecordByListId(this.tableCode, request).subscribe({
      next: (res) => {
        this.toast.success(res.result.message);
        this.setOfCheckedId = new Set<number>();
        this.refreshCheckedStatus();
        this.getData({ page: this.pageNumber, size: this.pageSize });
      }, error: (err) => {
        this.toast.error(err.result.message);
      }
    })
  }
  

  configColumn() {}
  getColumnNames(): string[] {
    return this.columns.map((column: any) => column.header);
  }

  headers: any[] = [];

  getHeaders() {
    this.manageComponentService.getColummnByTableName(this.tableCode).subscribe({
      next: (res) => {
        console.log(res);
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
        this.handleSearchTreeOptions();
      }, error: (err) => {
        console.log(err);
      }
    })
  }

  async export() {
    let request = {
      pageNumber: 0,
      pageSize: 0,
      common: '',
      filter: {
        machineCode: '',
        machineName: '',
        status: '',
        machineType: {},
        productivity: '',
        description: '',
        supplier: '',
        maintenanceTime: '',
        minProductionQuantity: '',
        maxProductionQuantity: '',
        purchaseDate: '',
        maxWaitingTime: '',
        cycleTime: '',
      },
    };

    let res = await this.machineService.getMachine(request);
    let listMachine = res.data;
    let header: any[] = [];
    for (let i = 0; i < listMachine.length; i++) {
      let stageTemplate1: Record<string, any> = {};
      for (let j = 0; j < this.columns.length; j++) {
        if (i == 0) {
          if (
            this.columns[j].keyName == 'maintenanceTime' ||
            this.columns[j].keyName == 'maxWaitingTime'
          ) {
            header.push(this.columns[j].keyTitle);
            header.push(`Đơn vị ${this.columns[j].keyTitle}`);
          } else {
            header.push(this.columns[j].keyTitle);
          }
        }
        if (this.columns[j].keyName === 'status') {
          const statusValue =
            listMachine[i][this.columns[j].keyName] === 1
              ? 'Hoạt động'
              : 'Ngừng hoạt động';
          stageTemplate1[this.columns[j].keyName] = statusValue;
        } else if (
          this.columns[j].keyName == 'maintenanceTime' ||
          this.columns[j].keyName == 'maxWaitingTime'
        ) {
          stageTemplate1[this.columns[j].keyName] =
            listMachine[i][this.columns[j].keyName];
          stageTemplate1[`Đơn vị ${this.columns[j].keyTitle}`];
        } else if (this.columns[j].keyName == 'machineType') {
          stageTemplate1[this.columns[j].keyName] =
            listMachine[i]['machineType']['machineTypeName'];
        } else {
          stageTemplate1[this.columns[j].keyName] =
            listMachine[i][this.columns[j].keyName];
        }
      }

      this.listMachineToExport[i] = stageTemplate1;

      let temp = {
        ...stageTemplate1,
      };
      this.listMachineToExport.push(temp);
    }
    this.exportService.exportExcel(
      this.listMachineToExport,
      'MachineData',
      header
    );
  }

  async importConfirm($event: any) {
    let res = this.http
      .post(`${environment.api_end_point}/api/machines/import-excel`, $event)
      .subscribe({
        next: (res: any) => {
          this.toast.success('Import file thành công');
          this.getData({ page: this.pageNumber, size: this.pageSize });
        },
        error: (err: any) => {
          this.toast.error(err.error.result.message);

          this.getData({ page: this.pageNumber, size: this.pageSize });
        },
      });
  }
  import() {
    this.isvisibleImport = true;
  }

  onClickIcon(element: any) {
    if (this.expandSet.has(element.machineCode)) {
      this.expandSet.delete(element.machineCode);
    } else {
      this.expandSet.add(element.machineCode);
    }
  }
  id = -1;
  onResize({ width }: NzResizeEvent, i: number): void {
    cancelAnimationFrame(this.id);
    this.id = requestAnimationFrame(() => {
      this.columns[i].width = width + 'px';
    });
  }

  addColumn() {
    this.isvisibleAddColumn = true;
  }
  onKeyUp(event: KeyboardEvent) {
    if (event.key === 'Enter') {
      if (this.machineCode.trim() === '') {
        this.popoverVisible = true;
      }
    } else {
      this.popoverVisible = false;
    }
  }
  popoverVisible: boolean = false;

  onPopoverVisibleChange(event: any) {
    if (this.machineCode.trim() === '') {
      this.popoverVisible = true;
    } else {
      this.popoverVisible = event;
    }
  }
  convertSecondsToDuration(seconds: number): string {
    if (!seconds) return '';

    const month = 2592000;
    const days = 86400;
    const hours = 3600;
    const minutes = 60;

    if (seconds % month === 0) {
      return seconds / month + ' tháng';
    }
    if (seconds % days === 0) {
      return seconds / days + ' ngày';
    }
    if (seconds % hours === 0) {
      return seconds / hours + ' giờ';
    }
    if (seconds % minutes === 0) {
      return seconds / minutes + ' phút';
    }
    return seconds + ' giây';
  }

  // New functions for dynamic form

  /**
   * Đây là hàm chọn tất cả các bản ghi trong bảng
   * @param value : đây là thông tin từng bản ghi
   */
  onAllChecked(value: boolean): void {
    this.listMachine.forEach(item => this.updateCheckedSet(item.id, value));
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
    this.checked = this.listMachine.every(item => this.setOfCheckedId.has(item.id));
    this.indeterminate = this.listMachine.some(item => this.setOfCheckedId.has(item.id)) && !this.checked;
  }

  /**
   * Đây là hàm xử lý sự kiện thay đổi vị trí hàng trong bảng
   * @param event : là thông tin về hàng được thay đổi vị trí
   */
  async drop(event: CdkDragDrop<string[], string, any>) {
    moveItemInArray(this.listMachine, event.previousIndex, event.currentIndex);
    if(event.previousIndex < event.currentIndex) {
      this.listMachine[event.currentIndex].index = this.listMachine[event.currentIndex - 1].index;
      this.manageComponentService.updateInforRecordById(
        this.tableCode, 
        this.listMachine[event.currentIndex].id, 
        this.listMachine[event.currentIndex]
      ).subscribe({
        next: (res) => {
        }, error: (err) => {
          console.log(err);
        }
      })
    } else {
      this.listMachine[event.currentIndex].index = this.listMachine[event.currentIndex + 1].index;
      this.manageComponentService.updateInforRecordById(
        this.tableCode, 
        this.listMachine[event.currentIndex].id, 
        this.listMachine[event.currentIndex]
      ).subscribe({
        next: (res) => {
        }, error: (err) => {
          console.log(err);
        }
      })
    }
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
        for(let i = 0; i < this.listMachine.length; i++) {
          if(item == this.listMachine[i].id) {
            request.push(this.listMachine[i]);
            break;
          }
        }
      })
      if(request.length > 0) {
        for(let i = 0; i < request.length; i++) {
          request[i][code] = request[i][code] + "-" + this.makeid(4);
        }
        this.manageComponentService.addListRecord(this.tableCode, request).subscribe({
          next: (res) => {
            this.toast.success(res.result.message);
            this.setOfCheckedId = new Set<number>();
            this.refreshCheckedStatus();
            this.getData({ page: this.pageNumber, size: this.pageSize });
            this.loader.stop();
          }, error: (err) => {
            this.toast.error(err.result.message);
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
   * Hàm gọi API và xử lý dữ liệu option cho select box
   */
   handleOpenChangeDataTypeParam(data: any, column: any) {
    if(data) {
      this.manageComponentService.getParamByTableNameAndColumnName(column.tableName, column.keyName).subscribe({
        next: (res) => {
          this.valueSelectBox = res.data;
        }, error: (err) => {
          this.toast.error(err.result.message);
        }
      })
    }
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

  /**
   * Xử lý sự kiện double click trên dòng trong table
   */
  onDblClickOnRowTable(infor: any) {
    console.log("test");
    this.inforComponent(infor);
  }

  ngOnDestroy(): void {
    console.log("ngOnDestroy");
    // localStorage.setItem('beforeBaseUrl', '');
  }


  /**
   * Xử lý sự kiện nhấn phím tắt Shift + N để thêm mới bản ghi
   * @param event 
   */
  @HostListener('document:keydown.shift.n', ['$event'])
  handleAddNew(event: any) {
    if(!this.isInputFocused) {
      this.addMachine();
    }
  }

  /**
   * Xử lý sự kiện nhấn phím tắt Delete để xoá nhiều bản ghi
   * @param event 
   */
  @HostListener('document:keydown.delete', ['$event'])
  handleDelete(event: any) {
    console.log(event);
    if(this.setOfCheckedId.size > 0) {
      this.openPopupDeleteList();
    } else {
      this.toast.warning("Vui lòng chọn bản ghi để sử dụng chức năng này!");
    }
  }

  /**
   * Xử lý sự kiện nhấn phím tắt F2 để cập nhật bản ghi
   * @param event 
   */
  @HostListener('document:keydown.F2', ['$event'])
  handleUpdate(event: any) {
    console.log(event);
  }

  /**
   * Xử lý sự kiện nhấn phím tắt Control + D để sao chép nhiều bản ghi
   * @param event 
   */
  @HostListener('document:keydown.shift.c', ['$event'])
  handleCopy(event: any) {
    if(this.setOfCheckedId.size > 0) {
      this.openPopupCopy();
    } else {
      this.toast.warning("Vui lòng chọn bản ghi để sử dụng chức năng này!");
    }
  }

  // @HostListener('document:keydown', ['$event'])
  // handleF5(event: any) {
  //   // event.defaultPrevented = true;
  //   console.log("Hoang: ", event);
  // }

  /**
   * Hàm thay đổi checkbox trong cây tìm kiếm
   * @param options 
   */
  changeSearchTree(options: string[]) {
    this.selectedOptions = options;
    this.getData({ page: this.pageNumber, size: this.pageSize });
  }

  /**
   * Hàm đóng mở cây tìm kiếm
   */
  changeTreeVisible() {
    if (this.treeVisible) {
      this.treeVisible = false;
      this.classList = {
        searchTree: "search-tree-container-close",
        content: "content-container-close",
      }
    } else {
      this.treeVisible = true;
      this.classList = {
        searchTree: "search-tree-container-open",
        content: "content-container-open",
      }
    }
  }

  handleSearchTreeOptions() {
    console.log("Column to find tree key",this.columns);
    for (let column of this.columns) {
      if (column.searchTree) {
        this.searchTreeName = column.keyTitle;
        this.manageComponentService.getParamByTableNameAndColumnName(column.tableName, column.keyName).subscribe({
          next: (res) => {
            this.searchTreeOptions = res.data;
          }, error: (err) => {
            this.toast.error(err.result.message);
          }
        })
        break;
      }
    }
  }

  protected readonly dataType = DATA_TYPE;
}