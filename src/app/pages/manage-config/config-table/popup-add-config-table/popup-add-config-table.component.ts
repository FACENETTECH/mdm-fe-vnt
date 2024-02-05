import { Component, EventEmitter, Input, OnInit, Output, HostListener } from '@angular/core';
import {
  FormBuilder,
  UntypedFormBuilder,
  Validators,
  UntypedFormControl,
  UntypedFormGroup,
} from '@angular/forms';
import { NzI18nService, en_US, vi_VN } from 'ng-zorro-antd/i18n';
import { ToastrService } from 'ngx-toastr';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { ManageComponentService } from 'src/app/services/manage-component/manage-component.service';
import { ConfigService } from 'src/app/services/manage-config/config.service';
import { InfoMachineService } from 'src/app/services/manage-machine-line/info-machine/info-machine.service';
import { DATA_TYPE } from 'src/app/utils/constrant';

@Component({
  selector: 'app-popup-add-config-table',
  templateUrl: './popup-add-config-table.component.html',
  styleUrls: ['./popup-add-config-table.component.css']
})
export class PopupAddConfigTableComponent {
  constructor(
    private toast: ToastrService,
    private machine: InfoMachineService,
    private manageService: ManageComponentService,
    private loader: NgxUiLoaderService,
    private configService: ConfigService
  ) {}
  @Input() isvisible: boolean = true;
  @Output() isvisibleChange: EventEmitter<boolean> = new EventEmitter();

  machineCode: string = '';
  machineName: string = '';
  status: string = '1';
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
  lineTypeList: any = [];
  productionLineTypeList: any = [];
  form!: UntypedFormGroup;
  inforTable: any;
  inforMachine: Record<string, any> = {};
  valueSelectBox: any = []; // Lưu trữ các giá trị của những trường có type là select box
  valueTypeParam: any = []; // Lưu trữ các giá trị của những trường có type là param
  columnKey: string = '';
  listColumnInFunction: any = [];
  columnsFunction: any = [];

  onSubmit(): void {}

  ngOnInit() {
    this.inforTable = JSON.parse(localStorage.getItem('baseUrl')!);
    this.getColumn();
  }

  parser = (value: any) => value.replace(/\$\s?|(,*)/g, '');
  formatter = (value: any): string => {
    let result = `${value}`.replace(',', '');
    result = `${result}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    return result;
  };

  confirmationValidator = (
    control: UntypedFormControl
  ): {
    [s: string]: boolean;
  } => {
    if (!control.value) {
      return { required: true };
    } else if (
      Date.parse(control.value) <
      Date.parse(this.form.controls['orderedTime'].value)
    ) {
      return { confirm: true, error: true };
    }
    return {};
  };

  index = 0;
  ismachineTypeValid(input: string): boolean {
    const isEmpty = input === '';
    const containsSpecialCharacter =
      /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(input);
    return !isEmpty && !containsSpecialCharacter;
  }
  addItem(inputElement: HTMLInputElement): void {
    
  }

  machineTypeList: any[] = [];
  id: string = '';
  machineTypeName: string = '';

  checkMachine: Record<string, any> = {};

  checkValid() {
    let charSpecial = /[&@₫()?!/"#%^*+=\|~<>$¥€?!']/;

    this.columns.map((x: any) => {
      if (
        x.isRequired == true &&
        (this.inforMachine[x.keyName] == null ||
          this.inforMachine[x.keyname] == '')
      ) {
        this.checkMachine[x.keyName] = `Không được bỏ trống ${x.keyTitle}`;
      } else if (
        x.keyName.includes('Code') &&
        charSpecial.test(this.inforMachine[x.keyName])
      ) {
        this.checkMachine[
          x.keyName
        ] = `Trường ${x.keyTitle} chứa ký tự đặc biệt`;
      } else {
        this.checkMachine[x.keyName] = '';
      }
    });
    console.log(this.checkMachine);
  }
  async getParam() {
    const request = {
      params: {
        id: this.id,
        machineTypeName: this.machineTypeName,
      },
    };
    let res = await this.machine.getMachineTypeList(request);
    console.log(res);
    this.machineTypeList = res.data;

    return this.machineTypeList;
  }
  isvisibleCancel: boolean = false;

  checkAction: boolean = false;
  handleCancel() {
    if (this.checkAction) {
      this.isvisibleCancel = true;
    } else {
      this.isvisibleChange.emit(false);
    }
  }

  cancelConfirm(event: any) {
    this.isvisibleChange.emit(false);
  }
  listOfValue1: any[] = [];

  listOfValue: any[] = [];
  listOfOption: any[] = [
    {
      value: 0,
      label: 'Giây',
    },
    {
      value: 1,
      label: 'Phút',
    },
    {
      value: 2,
      label: 'Giờ',
    },
    {
      value: 3,
      label: 'Ngày',
    },
    {
      value: 4,
      label: 'Tháng',
    },
  ];

  isNumber(input: string): boolean {
    return !isNaN(Number(input));
  }
  ismachineCodeValid(): boolean {
    const isEmpty = this.machineCode.trim() === '';
    const containsSpecialCharacter =
      /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(this.machineCode);
    return !isEmpty && !containsSpecialCharacter;
  }
  ismachineNameValid(): boolean {
    const isEmpty = this.machineName.trim() === '';
    const containsSpecialCharacter =
      /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(this.machineName);
    return !isEmpty && !containsSpecialCharacter;
  }
  isPositiveIntegerValid(input: string): boolean {
    if (input === undefined || input === null || input === '') {
      return true;
    }
    const positiveIntegerRegex = /^[1-9]\d*$/;
    return positiveIntegerRegex.test(input);
  }

  containsSpecialCharacters(input: string): boolean {
    if (input === undefined || input === null || input === '') {
      return true;
    }
    const specialCharacterRegex = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/;
    return specialCharacterRegex.test(input);
  }
  machineError: boolean = false;
  clearMachineError(): void {
    this.machineError = false;
  }
  isPositiveIntegerMinValid(input: string): boolean {
    if (input === undefined || input === null || input === '') {
      return true;
    }
    const positiveIntegerRegex = /^[1-9]\d*$/;
    const isMinValid = positiveIntegerRegex.test(this.minProductionQuantity);
    const isMaxValid = positiveIntegerRegex.test(this.maxProductionQuantity);
    if (!isMinValid || !isMaxValid) {
      return false;
    }
    const min = parseInt(this.minProductionQuantity, 10);
    const max = parseInt(this.maxProductionQuantity, 10);
    return min < max;
  }
  selectedUnit: string = 'Giây';
  selectedUnited: string = 'Giây';
  prevSelectedUnited: string | null = null;

  prevSelectedUnit: string | null = null;
  onUnitSelected() {
    if (this.selectedUnit !== this.prevSelectedUnit) {
      const maxWaitingTimeNumber = parseFloat(this.maxWaitingTime);
      if (isNaN(maxWaitingTimeNumber)) {
        return;
      }
      const maxWaitingTimeInSecond = this.convertToSeconds(
        maxWaitingTimeNumber,
        this.selectedUnit
      );
      this.maxWaitingTime = maxWaitingTimeInSecond.toString();
      this.prevSelectedUnit = this.selectedUnit;
    }
  }
  onUnitSelectedTime() {
    if (this.selectedUnited !== this.prevSelectedUnited) {
      const maxWaitingTimeNumber = parseFloat(this.maxWaitingTime);
      if (isNaN(maxWaitingTimeNumber)) {
        return;
      }
      const maxWaitingTimeInSecond = this.convertToSeconds(
        maxWaitingTimeNumber,
        this.selectedUnited
      );
      this.maxWaitingTime = maxWaitingTimeInSecond.toString();
      this.prevSelectedUnited = this.selectedUnited;
    }
  }
  convertToSeconds(value: number, unit: string): number {
    console.log(value);

    if (isNaN(value)) {
      return 0;
    }
    switch (unit) {
      case 'Phút':
        return value * 60;
      case 'Giờ':
        return value * 3600;
      case 'Ngày':
        return value * 86400;
      case 'Tháng':
        return value * 2592000;
      default:
        return value;
    }
  }
  convertedMaxWaitingTime: string | null = null;
  showErrorMachineType: boolean = false;
  showErrorMachineCode: boolean = false;
  showErrorMachineName: boolean = false;
  showErrorminProductionQuantity: boolean = false;
  showErrormaxProductionQuantity: boolean = false;
  showErrormaxWaitingTime: boolean = false;
  showErrormaintenanceTime: boolean = false;
  showErrorproductivity: boolean = false;

  isvisiblesubmit: boolean = false;

  submitDemo() {
    this.isvisiblesubmit = true;
  }

  async submit() {
    console.log("Infor table: ", this.inforMachine);
    console.log("Infor column: ", this.listColumnInFunction);
    this.loader.start();
    console.log(this.inforMachine)
    this.checkValid();
    let check = true;
    this.columns.map((x: any) => {
      if (this.checkMachine[x.keyName]) {
        this.toast.warning(this.checkMachine[x.keyName]);
        check = false;
        return;
      }
    });
    if(check) {
      let request = {
        ...this.inforMachine,
        columns: this.listColumnInFunction
      }
      this.configService.addNewCategory(request).subscribe({
        next: (res: any) => {
          console.log(res);
          this.toast.success(res.result.message);
          this.isvisible = false;
          this.isvisibleChange.emit(false);
          this.loader.stop();
        }, error: (err) => {
          this.toast.error(err.result.message);
          this.loader.stop();
        }
      })
    } else {
      this.toast.warning("Vui lòng nhập đầy đủ thông tin yêu cầu bắt buộc!");
      this.loader.stop();
    }
  }
  isvisibleAddColumn: boolean = false;
  addColumn() {
    this.isvisibleAddColumn = true;
  }
  pageNumber: number = 1;
  pageSize: number = 10;
  async getData(page: { page: number; size: number }) {
    let request = {
      pageNumber: page.page - 1,
      pageSize: page.size,
      filter: {},
    };

    console.log(this.columns);
  }

  async getColumn() {
    this.columns = dummyColumns;
    this.columnsFunction = columnsTable;
  }

  /**
   * Hàm gọi API và xử lý dữ liệu option cho select box
   */
  handleOpenChangeDataTypeParam(data: any, column: any) {
    console.log("Select: ", column);
    if(data) {
      this.manageService.getParamByTableNameAndColumnName(column.tableName, column.keyName).subscribe({
        next: (res) => {
          console.log("Select data: ", res);
          this.valueSelectBox = res.data;
        }, error: (err) => {
          this.toast.error(err.result.message);
        }
      })
    }
  }

  /**
   * Hàm gọi API và xử lý dữ liệu option cho select box với trường có đơn vị tính
   */
  handleOpenChangeUnit(data: any, column: any) {
    console.log("Unit: ", column);
    if(data) {
      if(column.note != '' && column.note != null) {
        this.manageService.getParamsByCode(column.note).subscribe({
          next: (res) => {
            console.log("Unit data: ", res);
            this.valueTypeParam = res.data;
          }, error: (err) => {
            this.toast.error(err.result.message);
          }
        });
      } else {
        this.toast.warning("Không tìm thấy tên cột!");
      }
    }
  }

  /**
   * Thêm 1 dòng vào trong bảng thêm mới column
   */
  addRowTable() {
    this.listColumnInFunction.push(
      {
        keyName: null,
        keyTitle: null,
        dataType: 0,
        isCode: false,
        hasUnit: false,
        note: null,
        isRequired: false,
        width: null
      }
    )
  }

  /**
   * Xóa 1 dòng vào trong bảng thêm mới column
   */
  deleteRowTable(item: any, index: any) {
    this.listColumnInFunction.splice(index, 1);
  }

  /**
   * Xử lý sự kiện nhấn phím tắt ESC để đóng popup
   * @param event 
   */
   @HostListener('document:keydown.Escape', ['$event'])
   handleUpdate(event: any) {
     console.log(event);
     this.handleCancel();
   }

  machineColumn: Record<string, any> = {};
  columns: any[] = [];
  total: number = 0;
  @Input() machinee: any = '';
  protected readonly dataType = DATA_TYPE;
}

const dummyColumns = [
  {
    "id": 1,
    "index": 1,
    "tableName": "config",
    "keyName": "displayName",
    "keyTitle": "Tên hiển thị",
    "isRequired": true,
    "dataType": 2,
    "hasUnit": false,
    "relateTable": null,
    "relateColumn": null,
    "note": null,
    "addition": null,
    "width": "200px",
    "isCode": false
  },
  {
    "id": 2,
    "index": 1,
    "tableName": "operation",
    "keyName": "label",
    "keyTitle": "Tên chức năng",
    "isRequired": true,
    "dataType": 2,
    "hasUnit": false,
    "relateTable": null,
    "relateColumn": null,
    "note": null,
    "addition": null,
    "width": "200px",
    "isCode": false
  },
  {
    "id": 3,
    "index": 1,
    "tableName": "operation",
    "keyName": "name",
    "keyTitle": "Mã chức năng",
    "isRequired": true,
    "dataType": 2,
    "hasUnit": false,
    "relateTable": null,
    "relateColumn": null,
    "note": null,
    "addition": null,
    "width": "200px",
    "isCode": false
  },
  {
    "id": 4,
    "index": 1,
    "tableName": "operation",
    "keyName": "isEntity",
    "keyTitle": "Là chức năng con",
    "isRequired": true,
    "dataType": 9,
    "hasUnit": false,
    "relateTable": null,
    "relateColumn": null,
    "note": null,
    "addition": null,
    "width": "200px",
    "isCode": false
  },
  {
    "id": 5,
    "index": 1,
    "tableName": "operation",
    "keyName": "link",
    "keyTitle": "Url",
    "isRequired": true,
    "dataType": 2,
    "hasUnit": false,
    "relateTable": null,
    "relateColumn": null,
    "note": null,
    "addition": null,
    "width": "200px",
    "isCode": false
  },
  {
    "id": 6,
    "index": 1,
    "tableName": "operation",
    "keyName": "color",
    "keyTitle": "Màu",
    "isRequired": false,
    "dataType": 2,
    "hasUnit": false,
    "relateTable": null,
    "relateColumn": null,
    "note": null,
    "addition": null,
    "width": "200px",
    "isCode": false
  }
]

const columnsTable = [
  {
    "id": 1,
    "index": 1,
    "tableName": "operation",
    "keyName": "keyName",
    "keyTitle": "Mã cột",
    "isRequired": true,
    "dataType": 2,
    "hasUnit": false,
    "relateTable": null,
    "relateColumn": null,
    "note": null,
    "addition": null,
    "width": "110px",
    "isCode": false
  },
  {
    "id": 2,
    "index": 2,
    "tableName": "operation",
    "keyName": "keyTitle",
    "keyTitle": "Tên cột",
    "isRequired": true,
    "dataType": 2,
    "hasUnit": false,
    "relateTable": null,
    "relateColumn": null,
    "note": null,
    "addition": null,
    "width": "110px",
    "isCode": false
  },
  {
    "id": 3,
    "index": 3,
    "tableName": "operation",
    "keyName": "dataType",
    "keyTitle": "Kiểu dữ liệu",
    "isRequired": false,
    "dataType": 9,
    "hasUnit": false,
    "relateTable": null,
    "relateColumn": null,
    "note": null,
    "addition": null,
    "width": "110px",
    "isCode": false
  },
  {
    "id": 4,
    "index": 4,
    "tableName": "operation",
    "keyName": "isCode",
    "keyTitle": "Mã định danh",
    "isRequired": false,
    "dataType": 5,
    "hasUnit": false,
    "relateTable": null,
    "relateColumn": null,
    "note": null,
    "addition": null,
    "width": "110px",
    "isCode": false
  },
  {
    "id": 5,
    "index": 5,
    "tableName": "operation",
    "keyName": "hasUnit",
    "keyTitle": "Có đơn vị",
    "isRequired": false,
    "dataType": 5,
    "hasUnit": false,
    "relateTable": null,
    "relateColumn": null,
    "note": null,
    "addition": null,
    "width": "110px",
    "isCode": false
  },
  {
    "id": 6,
    "index": 6,
    "tableName": "operation",
    "keyName": "note",
    "keyTitle": "Ghi chú",
    "isRequired": false,
    "dataType": 2,
    "hasUnit": false,
    "relateTable": null,
    "relateColumn": null,
    "note": null,
    "addition": null,
    "width": "110px",
    "isCode": false
  },
  {
    "id": 7,
    "index": 7,
    "tableName": "operation",
    "keyName": "isRequired",
    "keyTitle": "Bắt buộc",
    "isRequired": false,
    "dataType": 5,
    "hasUnit": false,
    "relateTable": null,
    "relateColumn": null,
    "note": null,
    "addition": null,
    "width": "110px",
    "isCode": false
  },
  {
    "id": 8,
    "index": 8,
    "tableName": "operation",
    "keyName": "width",
    "keyTitle": "Độ rộng",
    "isRequired": false,
    "dataType": 2,
    "hasUnit": false,
    "relateTable": null,
    "relateColumn": null,
    "note": null,
    "addition": null,
    "width": "110px",
    "isCode": false
  }
]
