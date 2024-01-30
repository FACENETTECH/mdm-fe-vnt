import { KeyedWrite } from '@angular/compiler';
import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import jspdf from 'jspdf';
import { NzI18nService, en_US } from 'ng-zorro-antd/i18n';
import { ToastrService } from 'ngx-toastr';
import { InfoMachineService } from 'src/app/services/manage-machine-line/info-machine/info-machine.service';
@Component({
  selector: 'app-info-machine-popup',
  templateUrl: './info-machine-popup.component.html',
  styleUrls: ['./info-machine-popup.component.css'],
})
export class InfoMachinePopupComponent {
  constructor(
    private toast: ToastrService,
    private machineService: InfoMachineService,
    private i18m: NzI18nService
  ) {}
  @Input() isvisible: boolean = true;
  @Input() machine: any = '';
  // @Input()row :  any;

  @Output() isvisibleChange: EventEmitter<boolean> = new EventEmitter();
  machintTypeSelect!: any;
  machineCode: string = '';
  machineName: string = '';
  status: string = '0';
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
  test: number = 1;
  pageNumber: number = 1;
  pageSize: number = 10;
  total: number = 0;
  columns: any[] = [];
  lineTypeList: any = [];
  // machineTypeList : any = [];
  productionLineTypeList: any = [];

  inforMachine: Record<string, any> = {};

  ismachineTypeValid(input: string): boolean {
    const isEmpty = input === '';
    const containsSpecialCharacter =
      /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(input);
    return !isEmpty && !containsSpecialCharacter;
  }
  addItem(inputElement: HTMLInputElement): void {
    const newItem = inputElement.value.trim();
    if (!this.ismachineTypeValid(newItem)) {
      this.showErrorMachineType = true;
      return;
    }
    this.showErrorMachineType = false;

    if (
      this.machineTypeList.findIndex(
        (item) => item.machineTypeName === newItem
      ) === -1
    ) {
      const requestData = {
        machineTypeName: newItem,
      };
      this.machineService
        .addTypeList(requestData)
        .then((response: any) => {
          this.getParam();
        })
        .catch((error: any) => {
          console.error(error);
        });
    }
  }

  checkMachine: Record<string, any> = {};

  checkValid() {
    console.log(this.inforMachine['machineType']);
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
      }
    });
  }

  ngOnInit() {
    this.inforMachine['machineType'] = {};
    this.machineCode = this.machine.machineCode;
    this.machineName = this.machine.machineName;
    this.status = this.machine.status;
    // this.machineType = this.machine.machineType;
    this.productivity = this.machine.productivity;
    this.supplier = this.machine.supplier;
    this.maintenanceTime = this.machine.maintenanceTime;
    this.minProductionQuantity = this.machine.minProductionQuantity;
    this.maxProductionQuantity = this.machine.maxProductionQuantity;
    this.purchaseDate = this.machine.purchaseDate;
    this.maxWaitingTime = this.machine.maxWaitingTime;
    this.cycleTime = this.machine.cycleTime;
    this.description = this.machine.description;

    // this.getData({page: this.pageNumber, size: this.pageSize});
    // this.getParam();
    this.initializeData();
    this.getRowDataAsString(this.machine);
  }
  async initializeData() {
    // this.getData({page: this.pageNumber, size: this.pageSize});
    this.getColumn();
    this.getParam();
  }
  parser = (value: any) => value.replace(/\$\s?|(,*)/g, '');
  formatter = (value: any): string => {
    let result = `${value}`.replace(',', '');
    result = `${result}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    return result;
  };
  machineTypeList: any[] = [];
  id: string = '';
  machineTypeName: string = '';
  async getParam() {
    const request = {
      params: {
        id: this.id,
        machineTypeName: this.machineTypeName,
      },
    };
    let res = await this.machineService.getMachineTypeList(request);
    this.machineTypeList = res.data;

    return this.machineTypeList;
  }

  async getData(page: { page: number; size: number }) {
    let request = {
      pageNumber: page.page - 1,
      pageSize: page.size,
      filter: {
        machineCode: this.machineCode,
        description: this.description,
        status: '',
        cycleTime: this.cycleTime,
        maxWaitingTime: this.maxWaitingTime,
        purchaseDate: this.purchaseDate,
        maxProductionQuantity: this.maxProductionQuantity,
        minProductionQuantity: this.minProductionQuantity,
        maintenanceTime: this.maintenanceTime,
        supplier: this.supplier,
        productivity: this.productivity,
        machineType: {},
        machineName: this.machineName,
      },
    };

    let res = await this.machineService.getMachine(request);
    this.columns = res.columns;
    this.total = res.dataCount;
  }
  @Input() machinee: any = '';

  machineColumn: Record<string, any> = {};

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
  showErrorMachineType: boolean = false;
  showErrorMachineCode: boolean = false;
  showErrorMachineName: boolean = false;
  showErrorminProductionQuantity: boolean = false;
  showErrormaxProductionQuantity: boolean = false;
  showErrormaxWaitingTime: boolean = false;
  showErrormaintenanceTime: boolean = false;
  showErrorproductivity: boolean = false;

  selectedUnit: string = 'Giấy';
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
    switch (unit) {
      case 'Giây':
        return value * 1;
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
  isvisiblesubmit: boolean = false;

  submitDemo() {
    this.isvisiblesubmit = true;
  }
  async submit() {
    // const maxWaitingTimeNumber = parseFloat(this.maxWaitingTime);
    // if (!isNaN(maxWaitingTimeNumber)) {
    //     const maxWaitingTimeInSecond = this.convertToSeconds(maxWaitingTimeNumber, this.selectedUnit);
    //     this.maxWaitingTime = maxWaitingTimeInSecond.toString();
    // } else {
    //     this.maxWaitingTime = '';
    // }
    // const maintenanceTimeNumber = parseFloat(this.maintenanceTime);
    // if (!isNaN(maxWaitingTimeNumber)) {
    //     const maintenanceTimeInSecond = this.convertToSeconds(maintenanceTimeNumber, this.selectedUnited);
    //     this.maintenanceTime = maintenanceTimeInSecond.toString();
    // } else {
    //     this.maintenanceTime = '';
    // }
    this.showErrorMachineCode = !this.ismachineCodeValid();
    this.showErrorMachineName = !this.ismachineNameValid();
    this.showErrorminProductionQuantity = !this.isPositiveIntegerMinValid(
      this.minProductionQuantity
    );
    this.showErrormaxProductionQuantity = !this.isPositiveIntegerValid(
      this.maxProductionQuantity
    );
    this.showErrormaxWaitingTime = !this.isPositiveIntegerValid(
      this.maxWaitingTime
    );
    this.showErrormaintenanceTime = !this.isPositiveIntegerValid(
      this.maintenanceTime
    );
    this.showErrorproductivity = !this.isPositiveIntegerValid(
      this.productivity
    );

    let check = true;

    this.columns.map((x: any) => {
      if (!this.inforMachine[x.keyName] && x.isRequired == true) {
        this.toast.warning(`Không được bỏ trống ${x.keyTitle}`);
        check = false;
        return;
      }
    });

    if (check) {
      const maxWaitingTimeNumber = parseFloat(
        this.inforMachine['maxWaitingTime']
      );
      if (!isNaN(maxWaitingTimeNumber)) {
        const maxWaitingTimeInSecond = this.convertToSeconds(
          maxWaitingTimeNumber,
          this.selectedUnit
        );
        this.inforMachine['maxWaitingTime'] = maxWaitingTimeInSecond.toString();
      } else {
        this.inforMachine['maxWaitingTime'] = '';
      }
      const maintenanceTimeNumber = parseFloat(
        this.inforMachine['maintenanceTime']
      );
      if (!isNaN(maintenanceTimeNumber)) {
        const maintenanceTimeInSecond = this.convertToSeconds(
          maintenanceTimeNumber,
          this.selectedUnited
        );
        this.inforMachine['maintenanceTime'] =
          maintenanceTimeInSecond.toString();
      } else {
        this.inforMachine['maintenanceTime'] = '';
      }

      let request: any = this.inforMachine;

      Object.keys(request).forEach((key) => {
        if (request[key] === '') {
          request[key] = null;
        }
      });
      this.columns.map((x: any) => {
        if (this.machineColumn[x.keyName]) {
          if (x.keyName != 'status') {
            request[x.keyName] = this.machineColumn[x.keyName]
              ? this.machineColumn[x.keyName]
              : '';
          }
        }
      });

      let res = await this.machineService.updateMachine(
        request,
        this.machineCode
      );
      if (res.result.ok) {
        this.toast.success('Cập nhật máy thành công', 'Thành công');
        this.isvisibleChange.emit(false);
      } else {
        this.toast.error(res.result.message, 'Cập nhật máy thất bại');
      }
    }
  }
  async getColumn() {
    let col = localStorage.getItem('machine');
    this.columns = JSON.parse(col ? col : '');
    this.columns = this.columns.filter((x: any) => {
      return x.check;
    });

    this.columns.map((x: any) => {
      this.inforMachine[x.keyName] = this.machine[x.keyName];
    });
    this.inforMachine['maintenanceTimeUnit'] =
      this.machine['maintenanceTimeUnit'];
    this.inforMachine['maxWaitingTimeUnit'] =
      this.machine['maxWaitingTimeUnit'];
    console.log(
      this.inforMachine['maintenanceTime'],
      this.inforMachine['maxWaitingTime']
    );

    if (!this.inforMachine['machineType']) {
      this.inforMachine['machineType'] = { id: '', machineTypeName: '' };
    }

    // this.columns.map((x : any) => {
    //     if (x.keyName != 'machineType') {
    //         this.machineColumn[x.keyName] = this.machine[x.keyName] ? this.machine[x.keyName] : '';

    //     }

    // })
    // this.columns.map((x : any) => {
    //     if (x.keyName == 'machineCode' || x.keyName == 'machineName' || x.keyName == 'status' || x.keyName == 'productivity' || x.keyName == 'machineType' || x.keyName == 'description' || x.keyName == 'supplier' || x.keyName == 'minProductionQuantity' || x.keyName == 'maxProductionQuantity' || x.keyName == 'maintenanceTime' || x.keyName == 'purchaseDate' || x.keyName == 'maxWaitingTime' || x.keyName == 'cycleTime')
    //       {  this.machineColumn[x.keyName] = this.machinee[x.keyName];
    //       }else {
    //         this.machineColumn[x.keyName] = this.machinee[x.keyName];
    //       }

    // })
    // this.columns.forEach((x : any) => {
    //     if (this.machineColumn[x.keyName]) {
    //         this.machineColumn[x.keyName] = this.machinee[x.keyName];
    //     }
    // });
  }
  showQrCode() {}
  public title = 'qr';
  public qrInfo = '';
  public width = 200;

  strQr: string = '';
  getRowDataAsString(machine: any): string {
    let key = Object.keys(machine);
    let col = localStorage.getItem('machine');
    let columns = JSON.parse(col ? col : '');
    console.log(columns);
    this.strQr = machine.machineCode + '|MACHINE';
    console.log('QR', this.strQr);

    // columns.map((c : any) => {
    //     console.log(c);

    //     this.strQr += c.keyTitle + ': ' + machine[c.keyName] + ' - ';

    // })
    // let str = "";

    // this.strQr += "Machine Code: " + machine.machineCode + " - Machine Name: " + machine.machineName + " - Machine Type: " + machine.machineType + " - Status: " + this.getStatusText(machine.status) + " - Description: " + machine.description + " - Productivity: " + machine.productivity + " - Supplier: " + machine.supplier + " - Max: " + machine.maxProductionQuantity + " - Min: " + machine.minProductionQuantity + " - Purchase Date: " + machine.purchaseDate + " - Max Waiting Time: " + machine.maxWaitingTime + " - Cycle Time: " + machine.cycleTime;
    return '';
  }
  getStatusText(status: number): string {
    return status === 1 ? 'Hoạt động' : 'Ngừng hoạt động';
  }
  showOptions: boolean = false;

  addNewOption(): void {
    this.isPopoverVisible = false;
  }
  isPopoverVisible: boolean = false;

  handleVisibleChange(visible: boolean): void {
    this.isPopoverVisible = visible;
  }

  convertSecondsToDuration(seconds: number, name: string) {
    const month = 2592000;
    const days = 86400;
    const hours = 3600;
    const minutes = 60;

    if (seconds == 0) {
      return;
    } else if (seconds % month === 0) {
      this.inforMachine[name] = seconds / month;
      if (name == 'maintenanceTime') this.selectedUnited = 'Tháng';
      else this.selectedUnit = 'Tháng';
    } else if (seconds % days === 0) {
      this.inforMachine[name] = seconds / days;
      if (name == 'maintenanceTime') this.selectedUnited = 'Ngày';
      else this.selectedUnit = 'Ngày';
    } else if (seconds % hours === 0) {
      this.inforMachine[name] = seconds / hours;
      if (name == 'maintenanceTime') this.selectedUnited = 'Giờ';
      else this.selectedUnit = 'Giờ';
    } else if (seconds % minutes === 0) {
      this.inforMachine[name] = seconds / minutes;
      if (name == 'maintenanceTime') this.selectedUnited = 'Phút';
      else this.selectedUnit = 'Phút';
    } else {
      this.inforMachine[name] = seconds;
      if (name == 'maintenanceTime') this.selectedUnited = 'Giây';
      else this.selectedUnit = 'Giây';
    }
  }

  @ViewChild('download', { static: false }) download!: ElementRef;
  printQR() {
    const canvas = document
      .getElementById('QR')
      ?.querySelector<HTMLCanvasElement>('canvas');
    if (canvas) {
      // this.download.nativeElement.href = canvas.toDataURL('image/png');
      // this.download.nativeElement.download = this.inforMaterial['productCode'];
      // const event = new MouseEvent('click');
      // this.download.nativeElement.dispatchEvent(event);
      let pdf = new jspdf(); // A4 size page of PDF
      var position = 50;
      let imgWidth = 100;
      let imgHeight = (canvas.height * imgWidth) / canvas.width;
      const contentDataURL = canvas.toDataURL('image/png');
      pdf.addImage(contentDataURL, 'PNG', 50, position, imgWidth, imgHeight);
      pdf.save(`${this.inforMachine['machineCode']}.pdf`); // Generated PDF
    }
  }
}
