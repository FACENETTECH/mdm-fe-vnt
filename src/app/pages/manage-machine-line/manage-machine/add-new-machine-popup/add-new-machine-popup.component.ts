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
  selector: 'app-add-new-machine-popup',
  templateUrl: './add-new-machine-popup.component.html',
  styleUrls: ['./add-new-machine-popup.component.css'],
})
export class AddNewMachinePopupComponent {
  constructor(
    private toast: ToastrService,
    private machine: InfoMachineService,
    private fb: UntypedFormBuilder,
    private i18n: NzI18nService,
    private manageService: ManageComponentService,
    private loader: NgxUiLoaderService,
    private configService: ConfigService
  ) {}
  @Input() isvisible: boolean = true;
  @Output() isvisibleChange: EventEmitter<boolean> = new EventEmitter();
  @Output() isvisibleAdd: EventEmitter<boolean> = new EventEmitter();

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
  tableCode: string = '';
  checkActionImage: boolean = false;
  listEntityByRelation: any[] = [];
  optionsRelation: any[] = [];
  columnRelation?: string;

  onSubmit(): void {}

  ngOnInit() {
    this.inforTable = JSON.parse(localStorage.getItem('baseUrl')!);
    let arr = window.location.href.split('/');
    this.tableCode = arr[arr.length - 1];
    this.getColumn();
    this.getAllEntity();
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
  addItem(inputElement: HTMLInputElement, isParam: any, column: any): void {
    const newItem = inputElement.value.trim();
    if(isParam) {
      let request = {
        value: newItem,
        tableName: this.tableCode,
        columnName: column.keyName
      }
      this.manageService.addValuesParam(request).subscribe({
        next: (res) => {
          inputElement.value = '';
          this.handleOpenChangeDataTypeParam(true, column);
        }, error: (err) => {
          this.toast.error(err.error.result.message);
        }
      })
    } else {
      let request = {
        value: newItem,
        paramCode: column.note
      }
      this.manageService.addValuesParam(request).subscribe({
        next: (res) => {
          inputElement.value = '';
          this.handleOpenChangeUnit(true, column);
        }, error: (err) => {
          this.toast.error(err.error.result.message);
        }
      })
    }
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
  }
  async getParam() {
    const request = {
      params: {
        id: this.id,
        machineTypeName: this.machineTypeName,
      },
    };
    let res = await this.machine.getMachineTypeList(request);
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
    this.loader.start();
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
      for(let i = 0; i < this.columns.length; i++) {
        if(this.columns[i].dataType == this.dataType.NUMBER && this.inforMachine[this.columns[i].keyName] != null && this.inforMachine[this.columns[i].keyName] != '') {
          this.inforMachine[this.columns[i].keyName] = this.inforMachine[this.columns[i].keyName].replace(/,/g, '');
          this.inforMachine[this.columns[i].keyName] = Number.parseFloat(this.inforMachine[this.columns[i].keyName]);
        }
      }
      this.manageService.addNewRecord(this.tableCode, this.inforMachine).subscribe({
        next: (res) => {
          let isImage = false;
          for(let i = 0; i < this.columns.length; i++) {
            if(this.columns[i].dataType == this.dataType.IMAGE) {
              isImage = true;
              break;
            }
          }
          if(isImage && this.checkActionImage) {
            this.manageService.uploadImageInComponents(this.tableCode, Number(res.data), this.formUpload).subscribe({
              next: (data) => {
                console.log(data);
                this.toast.success(res.result.message);
                this.isvisible = false;
                this.isvisibleChange.emit(false);
                this.isvisibleAdd.emit(true);
                this.loader.stop();
              }, error: (err) => {
                console.log(err);
                this.loader.stop();
              }
            })
          } else {
            this.toast.success(res.result.message);
            this.isvisible = false;
            this.isvisibleChange.emit(false);
            this.isvisibleAdd.emit(true);
            this.loader.stop();
          }
        }, error: (err) => {
          this.toast.error(err.error.result.message);
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
  }

  async getColumn() {
    this.manageService.getColummnByTableName(this.tableCode).subscribe({
      next: (res) => {
        this.columns = res.data;
        for(let i = 0; i < this.columns.length; i++) {
          if(this.columns[i].isCode) {
            this.columnKey = this.columns[i].keyName;
            break;
          }
        }
      }
    })
  }

  /**
   * Hàm gọi API và xử lý dữ liệu option cho select box
   */
  handleOpenChangeDataTypeParam(data: any, column: any) {
    if(data) {
      this.manageService.getParamByTableNameAndColumnName(column.tableName, column.keyName).subscribe({
        next: (res) => {
          this.valueSelectBox = res.data;
        }, error: (err) => {
          this.toast.error(err.error.result.message);
        }
      })
    }
  }

  /**
   * Hàm gọi API và xử lý dữ liệu option cho select box với trường có đơn vị tính
   */
  handleOpenChangeUnit(data: any, column: any) {
    if(data) {
      if(column.note != '' && column.note != null) {
        this.manageService.getParamsByCode(column.note).subscribe({
          next: (res) => {
            console.log("Unit data: ", res);
            this.valueTypeParam = res.data;
          }, error: (err) => {
            this.toast.error(err.error.result.message);
          }
        });
      } else {
        this.toast.warning("Không tìm thấy tên cột!");
      }
    }
  }

  /**
   * Hàm gọi API và xử lý dữ liệu option cho select box với trường có kiểu dữ liệu là relation
   */
  handleOpenChangeRelation(event: any, column: any) {
    this.columnRelation = '';
    if(this.listEntityByRelation.length > 0) {
      let tableCode = '';
      for(let i = 0; i < this.listEntityByRelation.length; i++) {
        if(this.listEntityByRelation[i].name == column.relateTable) {
          tableCode = this.listEntityByRelation[i].name;
        }
      }
      if(tableCode != '') {
        let request = {
          "pageNumber": 0,
          "pageSize": 0,
          "common": "",
          "filter": {},
          "sortOrder": "DESC",
          "sortProperty": "index",
          "searchOptions": []
        }
        this.manageService.getDataDynamicTable(tableCode, request).subscribe({
          next: (res) => {
            this.optionsRelation = res.data;
            this.manageService.getColummnByTableName(tableCode).subscribe({
              next: (res) => {
                for(let i = 0; i < res.data.length; i++) {
                  if(res.data[i].keyName == column.relateColumn) {
                    this.columnRelation = res.data[i].keyName;
                    break;
                  }
                }
              }
            })
          }, error: (err) => {
            this.toast.error(err.error.result.message);
          }
        })
      }
    }
  }

  /**
   * Hàm lấy ra tất cả bảng trong database
   */
  getAllEntity() {
    this.listEntityByRelation = [];
    this.configService.getAllCategory().subscribe({
      next: (res) => {
        for(let i = 0; i < res.data.length; i++) {
          if(res.data[i].isEntity) {
            this.listEntityByRelation.push(res.data[i])
          }
          if(res.data[i].children.length > 0) {
            for(let j = 0; j < res.data[i].children.length; j++) {
              if(res.data[i].children[j].isEntity) {
                this.listEntityByRelation.push(res.data[i].children[j])
              }
            }
          }
        }
      }, error: (err) => {
        this.toast.error(err.error.result.message);
      }
    })
  }

  /**
   * Hàm xử lý import file với những trường là ảnh
   */
  formUpload= new FormData();
  handleChange(item: any, column: any) {
    console.log(item.target.files['0']);
    this.formUpload.append(column.keyName, item.target.files['0']);
    this.inforMachine[column.keyName] = item.target.files['0'].name;
    console.log(column);
    console.log(this.inforMachine)
    console.log(this.formUpload)
  };

  /**
   * Hàm xử lý click vào form upload file
   */
  handleImageClick() {
    // document.getElementById('fileInput')?.click();
  }

  
  formatNumber(input: any) {
    // Lấy giá trị đang nhập từ input
    let value = input.value;
  
    // Loại bỏ tất cả các ký tự không phải chữ số hoặc dấu .
    value = value.replace(/[^0-9.]/g, '');
  
    // Kiểm tra nếu quá 3 kí tự sau dấu .
    if (value.indexOf('.') != -1 && value.indexOf('.') < value.length - 4) {
      value = value.slice(0, -1);
    }
    console.log("value", value);
    // Convert string thành number 
    const numberValue = Number.parseFloat(value);
    console.log("num value", numberValue);
    if (value[value.length - 1] != '.' && !isNaN(numberValue)) {
      // Định dạng lại giá trị với dấu phẩy
      const formattedValue = numberValue.toLocaleString('en-US', { useGrouping: true });
      // Gán giá trị đã được định dạng lại vào input
      input.value = formattedValue;
    }
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