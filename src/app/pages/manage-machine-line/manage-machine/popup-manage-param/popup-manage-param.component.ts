import { Component, Input, Output, EventEmitter } from '@angular/core';
import { NzResizeEvent } from 'ng-zorro-antd/resizable';
import { ToastrService } from 'ngx-toastr';
import { ManageComponentService } from 'src/app/services/manage-component/manage-component.service';
import { DATA_TYPE } from 'src/app/utils/constrant';

@Component({
  selector: 'app-popup-manage-param',
  templateUrl: './popup-manage-param.component.html',
  styleUrls: ['./popup-manage-param.component.css']
})
export class PopupManageParamComponent {
  @Input() isvisible: boolean = true;
  @Output() isvisibleChange: EventEmitter<boolean> = new EventEmitter();
  @Input() requestAddNewParam: any;

  isvisiblePopupAddParam: boolean = false;
  isvisiblePopupUpdateParam: boolean = false;
  isvisiblePopupDeleteParam: boolean = false;
  columns: any[] = [];
  listParam: any[] = [];
  inforParam: Record<string, any> = {};
  inforParamAddNew: Record<string, any> = {};
  noDataFound: boolean = false;
  valueSelectBox: any = []; // Lưu trữ các giá trị của những trường có type là select box

  constructor(
    private manageService: ManageComponentService,
    private toast: ToastrService
  ) {}

  ngOnInit() {
    this.columns = dummyColumns;
    if(this.requestAddNewParam != undefined && this.requestAddNewParam != null) {
      if(this.requestAddNewParam.hasOwnProperty('tableName') && this.requestAddNewParam.hasOwnProperty('columnName')) {
        this.handleOpenChangeDataTypeParam(this.requestAddNewParam);
      } else if(this.requestAddNewParam.hasOwnProperty('paramCode')) {
        this.handleOpenChangeUnit(this.requestAddNewParam);
      }
    }
  }

  handleCancel(): void {
    this.isvisible = false;
    this.isvisibleChange.emit(false);
  }

  handleCancelPopupAdd(): void {
    this.inforParamAddNew = {};
    this.isvisiblePopupAddParam = false;
    // this.isvisibleChange.emit(false);
  }

  handleCancelPopupUpdate(): void {
    this.inforParamAddNew = {};
    this.isvisiblePopupUpdateParam = false;
    // this.isvisibleChange.emit(false);
  }

  handleCancelPopupDelete(): void {
    this.inforParamAddNew = {};
    this.isvisiblePopupDeleteParam = false;
    // this.isvisibleChange.emit(false);
  }

  openModalAddParam() {
    this.isvisiblePopupAddParam = true;
  }

  openModalUpdateParam(infor: any) {
    this.columns.forEach((col) => {
      this.inforParamAddNew[col.keyName] = infor[col.keyName];
    })
    this.isvisiblePopupUpdateParam = true;
  }

  openModalDeleteParam(infor: any) {
    this.columns.forEach((col) => {
      this.inforParamAddNew[col.keyName] = infor[col.keyName];
    })
    this.isvisiblePopupDeleteParam = true;
  }

  id = -1;
  onResize({ width }: NzResizeEvent, i: number): void {
    cancelAnimationFrame(this.id);
    this.id = requestAnimationFrame(() => {
      this.columns[i].width = width + 'px';
    });
  }

  customSortFunction(event: any, sortColumn: string) {}

  clearInput(keyName: string) {
    this.inforParam[keyName] = '';
  }

  searchSelectBox($event: any) {
    // const searchData = {
    //   page: this.pageNumber,
    //   size: this.pageSize,
    // };
    // this.getData(searchData);
  }

  search($event: any) {
    // if ($event.keyCode === 13) {
    //   const searchData = {
    //     page: this.pageNumber,
    //     size: this.pageSize,
    //   };

    //   this.getData(searchData);
    // }
  }


  /**
   * Hàm gọi API và xử lý dữ liệu option cho select box
   */
  handleOpenChangeDataTypeParam(data: any) {
    this.manageService.getParamByTableNameAndColumnName(data.tableName, data.columnName).subscribe({
      next: (res: any) => {
        // this.listParam = res.data;
        this.listParam = res.data;
      }, error: (err) => {
        this.toast.error(err.error.result.message);
      }
    })
  }

  /**
   * Hàm gọi API và xử lý dữ liệu option cho select box với trường có đơn vị tính
   */
  handleOpenChangeUnit(data: any) {
    this.manageService.getParamsByCode(data.paramCode).subscribe({
      next: (res) => {
        this.listParam = res.data;
      }, error: (err) => {
        this.toast.error(err.error.result.message);
      }
    });
  }

  checkMachine: Record<string, any> = {};
  checkValid(keyName: string, keyTitle: string, isRequired: boolean): boolean {
    let charSpecial = /[&@₫()?!/"#%^*+=\|~<>$¥€?!']/;
    if (
      isRequired == true &&
      (this.inforParamAddNew[keyName] == null ||
        this.inforParamAddNew[keyName] == '')
    ) {
      this.checkMachine[keyName] = `Không được bỏ trống ${this.inforParamAddNew[keyTitle]}`;
      return false;
    } else if (
      charSpecial.test(this.inforParamAddNew[keyName])
    ) {
      this.checkMachine[keyName] = `Trường ${keyTitle} chứa ký tự đặc biệt`;
      return false;
    } else {
      this.checkMachine[keyName] = '';
      return true;
    }
  }

  submitAddNewParam() {
    let check = this.checkValid(this.columns[1].keyName, this.columns[1].keyTitle, this.columns[1].isRequired);
    if(check) {
      this.requestAddNewParam.value = this.inforParamAddNew[this.columns[1].keyName];
      this.requestAddNewParam.description = this.inforParamAddNew.hasOwnProperty(this.columns[2].keyName) ? this.inforParamAddNew[this.columns[2].keyName] : null;
      this.manageService.addValuesParam(this.requestAddNewParam).subscribe({
        next: (res) => {
          this.toast.success(res.result.message);
          this.inforParamAddNew = {};
          this.isvisiblePopupAddParam = false;
          this.ngOnInit();
        }, error: (err) => {
          this.toast.error(err.error.result.message);
        }
      })
    } else {
      this.toast.warning('Vui lòng kiểm tra lại giá trị của các trường bắt buộc!')
    }
  }

  submitUpdateParam() {
    let check = this.checkValid(this.columns[1].keyName, this.columns[1].keyTitle, this.columns[1].isRequired);
    if(check) {
      this.requestAddNewParam.id = this.inforParamAddNew[this.columns[0].keyName];
      this.requestAddNewParam.value = this.inforParamAddNew[this.columns[1].keyName];
      this.requestAddNewParam.description = this.inforParamAddNew.hasOwnProperty(this.columns[2].keyName) ? this.inforParamAddNew[this.columns[2].keyName] : null;
      this.manageService.updateValuesParam(this.requestAddNewParam).subscribe({
        next: (res) => {
          this.toast.success(res.result.message);
          this.inforParamAddNew = {};
          this.isvisiblePopupUpdateParam = false;
          this.ngOnInit();
        }, error: (err) => {
          this.toast.error(err.error.result.message);
        }
      })
    } else {
      this.toast.warning('Vui lòng kiểm tra lại giá trị của các trường bắt buộc!')
    }
  }

  submitDeleteParam() {
    this.manageService.deleteValueParamById(this.inforParamAddNew[this.columns[0].keyName]).subscribe({
      next: (res) => {
        this.toast.success(res.result.message);
        this.inforParamAddNew = {};
        this.isvisiblePopupDeleteParam = false;
        this.ngOnInit();
      }, error: (err) => {
        this.toast.error(err.error.result.message);
      }
    })
  }

  protected readonly dataType = DATA_TYPE;
}

const dummyColumns = [
  {
    "id": 88,
    "index": 1,
    "tableName": "param",
    "keyName": "id",
    "keyTitle": "Id tham số",
    "isRequired": true,
    "dataType": 2,
    "hasUnit": false,
    "relateTable": null,
    "relateColumn": null,
    "note": null,
    "addition": null,
    "width": "200px",
    "isCode": true,
    "searchTree": null,
    "localCheck": true
  },
  {
    "id": 88,
    "index": 2,
    "tableName": "param",
    "keyName": "value",
    "keyTitle": "Giá trị tham số",
    "isRequired": true,
    "dataType": 2,
    "hasUnit": false,
    "relateTable": null,
    "relateColumn": null,
    "note": null,
    "addition": null,
    "width": "200px",
    "isCode": false,
    "searchTree": null,
    "localCheck": true
  },
  {
    "id": 88,
    "index": 3,
    "tableName": "param",
    "keyName": "description",
    "keyTitle": "Mô tả",
    "isRequired": false,
    "dataType": 2,
    "hasUnit": false,
    "relateTable": null,
    "relateColumn": null,
    "note": null,
    "addition": null,
    "width": "200px",
    "isCode": false,
    "searchTree": null,
    "localCheck": true
  }
]
