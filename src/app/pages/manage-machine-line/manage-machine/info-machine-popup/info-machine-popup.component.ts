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
  selector: 'app-info-machine-popup',
  templateUrl: './info-machine-popup.component.html',
  styleUrls: ['./info-machine-popup.component.css'],
})
export class InfoMachinePopupComponent {
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
  @Input() inforComponent: any = '';
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
  inforImage: Record<string, any> = {};
  tableCode: string = '';
  checkActionImage: boolean = false;
  listEntityByRelation: any[] = [];
  optionsRelation: any[] = [];
  columnRelation?: string;

  onSubmit(): void {}

  ngOnInit() {
    this.inforTable = JSON.parse(localStorage.getItem('baseUrl')!);
    if(this.inforTable.children.length > 0) {
      this.tableCode = localStorage.getItem('currentSider')!;
    } else {
      this.tableCode = this.inforTable.name;
    }
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
      for(let i = 0; i < this.columns.length; i++) {
        if(this.columns[i].dataType == this.dataType.NUMBER) {
          this.inforMachine[this.columns[i].keyName] = this.inforMachine[this.columns[i].keyName].replace(/,/g, '');
          this.inforMachine[this.columns[i].keyName] = Number.parseInt(this.inforMachine[this.columns[i].keyName]);
        }
      }
      this.manageService.updateInforRecordById(this.tableCode, this.inforMachine['id'], this.inforMachine).subscribe({
        next: (res) => {
          console.log(res);
          let isImage = false;
          for(let i = 0; i < this.columns.length; i++) {
            if(this.columns[i].dataType == this.dataType.IMAGE) {
              isImage = true;
              break;
            }
          }
          if(isImage && this.checkActionImage) {
            this.manageService.uploadImageInComponents(this.tableCode, this.inforMachine['id'], this.formUpload).subscribe({
              next: (data) => {
                console.log(data);
                this.toast.success(res.result.message);
                this.isvisible = false;
                this.isvisibleChange.emit(false);
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
            this.loader.stop();
          }
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
    this.manageService.getColummnByTableName(this.tableCode).subscribe({
      next: (res) => {
        this.columns = res.data;
        console.log(this.columns);
        this.getImageByName();
        this.formatNumberInUpdate();
        this.getRowDataAsString(this.inforComponent);
      }
    })
  }

  /**
   * Hàm lấy ra danh sách ảnh theo column
   */
  getImageByName() {
    this.manageService.getImageInComponents(this.tableCode, this.inforMachine['id']).subscribe({
      next: (res) => {
        console.log(res);
        this.inforImage = res.data;
      }, error: (err) => {
        console.log(err);
      }
    })
  }

  /**
   * Hàm gọi API và xử lý dữ liệu option cho select box
   */
  async handleOpenChangeDataTypeParam(data: any, column: any) {
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
  async handleOpenChangeUnit(data: any, column: any) {
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
   * Hàm lấy danh sách param phụ thuộc theo cột hoặc theo trường hasUnit
   */
  async getParamsOnInit() {
    for(let i = 0; i < this.columns.length; i++) {
      if(this.columns[i].dataType == this.dataType.PARAM) {
        await this.handleOpenChangeDataTypeParam(true, this.columns[i]);
      } else if(this.columns[i].hasUnit) {
        await this.handleOpenChangeUnit(true, this.columns[i]);
      } else if(this.columns[i].dataType == this.dataType.RELATION) {
        await this.handleOpenChangeRelation(true, this.columns[i]);
      }
    }
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

   /**
   * Hàm gọi API và xử lý dữ liệu option cho select box với trường có kiểu dữ liệu là relation
   */
  async handleOpenChangeRelation(event: any, column: any) {
    this.columnRelation = '';
    console.log(column);
    console.log(this.listEntityByRelation);
    if(this.listEntityByRelation.length > 0) {
      let tableCode = '';
      for(let i = 0; i < this.listEntityByRelation.length; i++) {
        if(this.listEntityByRelation[i].id == Number.parseInt(column.relateTable)) {
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
                  if(res.data[i].id == Number.parseInt(column.relateColumn)) {
                    this.columnRelation = res.data[i].keyName;
                    break;
                  }
                }
              }
            })
          }, error: (err) => {
            this.toast.error(err.result.message);
          }
        })
      }
    }
  }

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
        this.getParamsOnInit();
        console.log(this.listEntityByRelation);
      }, error: (err) => {
        this.toast.error(err.result.message);
      }
    })
  }

  /**
   * Hàm xử lý để sinh mã QR cho từng bản ghi
   */
  strQr: string = '';
  getRowDataAsString(inforData: any) {
    for(let i = 0; i < this.columns.length; i++) {
      if(this.columns[i].isCode) {
        this.strQr = inforData[this.columns[i].keyName];
      }
    }
  }

  /**
   * Hàm format định dạng dấu phẩy hàng nghìn, vd: 100000 -> 100,000
   * @param input Giá trị người dùng nhập vào
   */
  formatNumber(input: any) {
    // Lấy giá trị đang nhập từ input
    let value = input.value;
  
    // Loại bỏ tất cả các dấu phẩy
    value = value.replace(/,/g, '');
  
    // Chuyển đổi giá trị thành số và kiểm tra nếu nó là một số hợp lệ
    const numberValue = Number(value);
    if (!isNaN(numberValue)) {
      // Định dạng lại giá trị với dấu phẩy
      const formattedValue = numberValue.toLocaleString('en-US', { useGrouping: true });
      // Gán giá trị đã được định dạng lại vào input
      input.value = formattedValue;
    }
  }

  async formatNumberInUpdate() {
    for(const property in this.inforComponent) {
      if(property != 'id' && (typeof this.inforComponent[property] == 'number')) {
        this.inforComponent[property] = this.inforComponent[property].toLocaleString('en-US', { useGrouping: true });
      }
    }
    for(let i = 0; i < this.columns.length; i++) {
      if(this.columns[i].dataType == this.dataType.RELATION) {
        this.inforComponent[this.columns[i].keyName] = Number.parseInt(this.inforComponent[this.columns[i].keyName]);
      }
    }
    console.log('Infor: ', this.inforComponent);
    this.inforMachine = this.inforComponent;
    this.getAllEntity();
  }

  /**
   * Xử lý sự kiện nhấn phím tắt ESC để đóng popup
   * @param event 
   */
   @HostListener('document:keydown.Escape', ['$event'])
   handleEscape(event: any) {
     console.log(event);
     this.handleCancel();
   }

  machineColumn: Record<string, any> = {};
  columns: any[] = [];
  total: number = 0;
  @Input() machinee: any = '';
  protected readonly dataType = DATA_TYPE;
}
