import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { ManageComponentService } from 'src/app/services/manage-component/manage-component.service';
import { ConfigService } from 'src/app/services/manage-config/config.service';
import { DATA_TYPE } from 'src/app/utils/constrant';

@Component({
  selector: 'app-popup-create-or-update-bom',
  templateUrl: './popup-create-or-update-bom.component.html',
  styleUrls: ['./popup-create-or-update-bom.component.css']
})
export class PopupCreateOrUpdateBomComponent {
  @Input() isvisible: boolean = true;
  @Input() inforComponent: any;
  @Output() isvisibleChange: EventEmitter<boolean> = new EventEmitter();
  @Output() isvisibleUpdate: EventEmitter<boolean> = new EventEmitter();
  columns: any[] = [];
  inforBOM: Record<string, any> = {};
  id: string = '';
  valueTypeParam: any = []; // Lưu trữ các giá trị của những trường có type là param
  requestAddNewParam: any;
  isVisibleManageParam: boolean = false;
  tableCode: string = 'bom_details';
  showErrorMachineType: boolean = false;
  valueSelectBox: any = []; // Lưu trữ các giá trị của những trường có type là select box
  listEntityByRelation: any[] = [];
  optionsRelation: any[] = [];
  columnRelation?: string;
  listChildrenBom: any[] = [];
  columnsStage: any[] = [];
  listStageOfBom: any[] = [];

  constructor(private loader: NgxUiLoaderService, private manageService: ManageComponentService, private toast: ToastrService, private configService: ConfigService){}

  ngOnInit() {
    this.getColumns();
    this.getColumnsStage();
    this.getAllEntity();
  }

  checkAction: boolean = false;
  handleCancel() {
    if (this.checkAction) {
      this.isvisible = true;
    } else {
      this.isvisibleChange.emit(false);
    }
  }

  getColumns() {
    this.loader.start();
    this.manageService.getColummnByTableName(this.tableCode).subscribe({
      next: (res) => {
        this.loader.stop();
        this.columns = [...res.data];
        // this.getSearchTreeNodes();
      },
      error: (err) => {
        this.loader.stop();
      },
    });
  }

  getColumnsStage() {
    this.loader.start();
    this.manageService.getColummnByTableName('technology_process_operation').subscribe({
      next: (res) => {
        this.loader.stop();
        this.columnsStage = [...res.data];
        this.getDataStages();
        // this.getSearchTreeNodes();
      },
      error: (err) => {
        this.loader.stop();
      },
    });
  }

  getDataStages() {
    this.loader.start();
    let request = {
      pageNumber: 0,
      pageSize: 0,
      common: "",
      filter: {
        technology_process_code: 'MSC002btH35-AU1'
      },
      sortOrder: "DESC",
      sortProperty: "index",
      searchOptions: []
    }
    this.manageService.getDataDynamicTable('technology_process_operation', request).subscribe({
      next: (res) => {
        this.loader.stop();
        this.listStageOfBom = [...res.data];
        console.log(this.listStageOfBom);
        // this.getSearchTreeNodes();
      },
      error: (err) => {
        this.loader.stop();
      },
    });
  }

  formatNumber(input: any) {
    // Lấy giá trị đang nhập từ input
    let value = input.value;
  
    // Loại bỏ tất cả các ký tự không phải chữ số hoặc dấu .
    value = value.replace(/[^0-9.]/g, '');

    // Convert string thành number 
    const numberValue = Number.parseFloat(value);
    if (value[value.length - 1] != '.' && !isNaN(numberValue)) {
      // Định dạng lại giá trị với dấu phẩy
      const formattedValue = numberValue.toLocaleString('en-US', { 
        useGrouping: true,
        maximumSignificantDigits: 20
       });
      // Gán giá trị đã được định dạng lại vào input
      input.value = formattedValue;
    }
  }

  checkMachine: Record<string, any> = {};

  checkValid() {
    let charSpecial = /[&@₫()?!/"#%^*+=\|~<>$¥€?!']/;

    this.columns.map((x: any) => {
      if (
        x.isRequired == true &&
        (this.inforBOM[x.keyName] == null ||
          this.inforBOM[x.keyname] == '')
      ) {
        this.checkMachine[x.keyName] = `Không được bỏ trống ${x.keyTitle}`;
      } else if (
        x.keyName.includes('Code') &&
        charSpecial.test(this.inforBOM[x.keyName])
      ) {
        this.checkMachine[
          x.keyName
        ] = `Trường ${x.keyTitle} chứa ký tự đặc biệt`;
      } else {
        this.checkMachine[x.keyName] = '';
      }
    });
  }

  /**
   * Hàm gọi API và xử lý dữ liệu option cho select box với trường có đơn vị tính
   */
  handleOpenChangeUnit(data: any, column: any) {
    if(data) {
      if(column.note != '' && column.note != null) {
        this.manageService.getParamsByCode(column.note).subscribe({
          next: (res) => {
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

  parser = (value: any) => value.replace(/\$\s?|(,*)/g, '');
  formatter = (value: any): string => {
    let result = `${value}`.replace(',', '');
    result = `${result}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    return result;
  };

  addItem(isParam: any, column: any): void {
    if(isParam) {
      this.requestAddNewParam = {
        tableName: this.tableCode,
        columnName: column.keyName
      }
    } else {
      this.requestAddNewParam = {
        paramCode: column.note
      }
    }
    this.isVisibleManageParam = true;
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
   * Hàm gọi API và xử lý dữ liệu option cho select box với trường có kiểu dữ liệu là relation
   */
  handleOpenChangeRelation(event: any, column: any) {
    // this.columnRelation = '';
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

  addNewRow() {
    let record: Record<string, any> = {};
    this.columns.forEach((col) => {
      record[col.name] = null;
    })
    this.listChildrenBom.push({
      ...record
    })
  }

  deleteRow(data: any, index: number) {
    this.listChildrenBom.splice(index, 1);
  }

  addNewRowTableStage() {
    let record: Record<string, any> = {};
    this.columnsStage.forEach((col) => {
      record[col.name] = null;
    })
    this.listStageOfBom.push({
      ...record
    })
  }

  deleteRowTableStage(data: any, index: number) {
    this.listStageOfBom.splice(index, 1);
  }

  async submit() {
  }

  protected readonly dataType = DATA_TYPE;
}
